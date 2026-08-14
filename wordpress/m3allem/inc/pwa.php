<?php
/**
 * PWA layer: manifest, service worker, offline page.
 *
 * Both files are served from the site root through rewrite rules. That matters
 * for the worker: a script under /wp-content/ can only control /wp-content/,
 * so serving it at /m3allem-sw.js is what gives it the whole site as scope.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

const M3ALLEM_SW_PATH       = 'm3allem-sw.js';
const M3ALLEM_MANIFEST_PATH = 'm3allem-manifest.webmanifest';

add_action( 'init', 'm3allem_pwa_rewrites' );
function m3allem_pwa_rewrites() {
	add_rewrite_rule( '^' . M3ALLEM_SW_PATH . '$', 'index.php?m3_pwa=sw', 'top' );
	add_rewrite_rule( '^' . M3ALLEM_MANIFEST_PATH . '$', 'index.php?m3_pwa=manifest', 'top' );
}

add_filter( 'query_vars', 'm3allem_pwa_query_var' );
function m3allem_pwa_query_var( $vars ) {
	$vars[] = 'm3_pwa';
	return $vars;
}

add_action( 'template_redirect', 'm3allem_pwa_serve' );
function m3allem_pwa_serve() {
	$what = get_query_var( 'm3_pwa' );
	if ( ! $what ) {
		return;
	}

	nocache_headers();

	if ( 'manifest' === $what ) {
		header( 'Content-Type: application/manifest+json; charset=utf-8' );
		echo wp_json_encode( m3allem_manifest(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	if ( 'sw' === $what ) {
		header( 'Content-Type: application/javascript; charset=utf-8' );
		// Without this the browser refuses the root scope we asked for.
		header( 'Service-Worker-Allowed: /' );
		m3allem_service_worker();
		exit;
	}
}

function m3allem_manifest() {
	$icon192 = get_template_directory_uri() . '/assets/icons/icon-192.png';
	$icon512 = get_template_directory_uri() . '/assets/icons/icon-512.png';

	$custom = (int) get_theme_mod( 'm3_app_icon', 0 );
	if ( $custom ) {
		$src192 = wp_get_attachment_image_url( $custom, array( 192, 192 ) );
		$src512 = wp_get_attachment_image_url( $custom, array( 512, 512 ) );
		if ( $src192 ) {
			$icon192 = $src192;
		}
		if ( $src512 ) {
			$icon512 = $src512;
		}
	}

	return array(
		'name'             => get_bloginfo( 'name' ),
		'short_name'       => get_theme_mod( 'm3_app_short_name', 'المعلّم' ),
		'description'      => get_bloginfo( 'description' ),
		'lang'             => 'ar',
		'dir'              => 'rtl',
		'start_url'        => home_url( '/' ),
		'scope'            => home_url( '/' ),
		'display'          => 'standalone',
		'orientation'      => 'portrait',
		'background_color' => '#0B0B0C',
		'theme_color'      => '#0B0B0C',
		'categories'       => array( 'business', 'lifestyle', 'utilities' ),
		'icons'            => array(
			array(
				'src'   => $icon192,
				'sizes' => '192x192',
				'type'  => 'image/png',
			),
			array(
				'src'     => $icon512,
				'sizes'   => '512x512',
				'type'    => 'image/png',
				'purpose' => 'any maskable',
			),
		),
		'shortcuts'        => array(
			array(
				'name' => 'قلّب على معلّم',
				'url'  => home_url( '/client/' ),
			),
			array(
				'name' => 'الداشبورد ديالي',
				'url'  => home_url( '/pro/' ),
			),
		),
	);
}

/**
 * Cache the shell, serve the network first for pages so artisan data stays
 * fresh, and fall back to the offline page when the network is gone.
 */
function m3allem_service_worker() {
	$version  = M3ALLEM_VERSION;
	$offline  = home_url( '/?m3_offline=1' );
	$style    = get_stylesheet_uri();
	$script   = get_template_directory_uri() . '/assets/js/m3allem.js';
	$icon     = get_template_directory_uri() . '/assets/icons/icon-192.png';
	?>
const CACHE = 'm3allem-v<?php echo esc_js( $version ); ?>';
const SHELL = [
  <?php echo wp_json_encode( $offline ); ?>,
  <?php echo wp_json_encode( $style ); ?>,
  <?php echo wp_json_encode( $script ); ?>,
  <?php echo wp_json_encode( $icon ); ?>
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never cache the admin or the AJAX endpoint.
  if (url.pathname.startsWith('/wp-admin') || url.pathname.includes('admin-ajax.php')) return;

  // Pages: network first, so a new artisan shows up right away.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(<?php echo wp_json_encode( $offline ); ?>)))
    );
    return;
  }

  // Assets: cache first, they are versioned.
  e.respondWith(
    caches.match(req).then((hit) => {
      return (
        hit ||
        fetch(req).then((res) => {
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
      );
    })
  );
});
	<?php
}

/* ------------------------------------------------------------------ *
 * Head tags and worker registration
 * ------------------------------------------------------------------ */

add_action( 'wp_head', 'm3allem_pwa_head', 1 );
function m3allem_pwa_head() {
	printf( '<link rel="manifest" href="%s">' . "\n", esc_url( home_url( '/' . M3ALLEM_MANIFEST_PATH ) ) );
	echo '<meta name="theme-color" content="#0B0B0C">' . "\n";
	echo '<meta name="mobile-web-app-capable" content="yes">' . "\n";
	echo '<meta name="apple-mobile-web-app-capable" content="yes">' . "\n";
	echo '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">' . "\n";
	printf(
		'<link rel="apple-touch-icon" href="%s">' . "\n",
		esc_url( get_template_directory_uri() . '/assets/icons/icon-192.png' )
	);
}

add_action( 'wp_footer', 'm3allem_pwa_register', 99 );
function m3allem_pwa_register() {
	if ( ! is_ssl() && ! m3allem_is_localhost() ) {
		return; // Service workers need HTTPS.
	}
	?>
	<script>
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function () {
			navigator.serviceWorker.register(<?php echo wp_json_encode( home_url( '/' . M3ALLEM_SW_PATH ) ); ?>, { scope: '/' });
		});
	}
	</script>
	<?php
}

function m3allem_is_localhost() {
	$host = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';
	return in_array( explode( ':', $host )[0], array( 'localhost', '127.0.0.1' ), true );
}

/* ------------------------------------------------------------------ *
 * Offline page
 * ------------------------------------------------------------------ */

add_action( 'template_redirect', 'm3allem_offline_page' );
function m3allem_offline_page() {
	if ( ! isset( $_GET['m3_offline'] ) ) {
		return;
	}
	get_header();
	?>
	<section class="app on">
		<div class="card" style="text-align:center;padding:60px 30px;max-width:520px;margin:40px auto">
			<div style="font-size:44px">📡</div>
			<h2 style="font-size:26px;font-weight:900;margin-top:16px">ماكاينش الأنترنيت</h2>
			<p style="opacity:.72;margin-top:12px;line-height:1.9">
				شكل الكونيكسيون مقطوعة. شوف الأنترنيت ديالك وعاود.
			</p>
			<button class="btn gold" style="margin-top:22px" onclick="location.reload()">عاود جرّب</button>
		</div>
	</section>
	<?php
	get_footer();
	exit;
}

/* ------------------------------------------------------------------ *
 * Flush rewrites once so /m3allem-sw.js resolves without a manual save
 * ------------------------------------------------------------------ */

add_action( 'after_switch_theme', 'm3allem_pwa_flush' );
function m3allem_pwa_flush() {
	m3allem_pwa_rewrites();
	flush_rewrite_rules();
}
