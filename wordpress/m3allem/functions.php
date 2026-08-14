<?php
/**
 * M3allem theme bootstrap: content types, roles, assets.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

define( 'M3ALLEM_VERSION', '1.1.0' );

/** Craft slugs are used by the walkthrough, so keep them stable. */
function m3allem_default_crafts() {
	return array(
		'plumb' => array( 'الماء والصحي', 'تسربة، شوفاج، روبيني، صانيطير — كلشي لي عندو علاقة بالما.', 'تسربة الما, روبيني, شوفاج, صانيطير' ),
		'elec'  => array( 'الضو والكهرباء', 'كومبتور، تابلو، بريز، لومير، وكل شي كهربائي فالدار.', 'تابلو, بريز, لومير, كومبتور' ),
		'wood'  => array( 'الخشب والنجارة', 'بيبان، كوزينة، بلاكار، وخدمة الخشب على المقاس.', 'بيبان, كوزينة, بلاكار, صيانة' ),
		'paint' => array( 'الصباغة والديكور', 'صباغة، تادلاكت، جبس، وديكور يبدّل الدار كاملة.', 'صباغة, تادلاكت, جبس, ديكور' ),
		'tile'  => array( 'البناء والزليج', 'زليج، كارو، بناء، وترميم بجودة ديال المعلّمية.', 'زليج, كارو, بناء, ترميم' ),
		'cool'  => array( 'التبريد والكليما', 'كليماتيزور، تلاجة، كونجيلاتور — تركيب وإصلاح.', 'كليما, تلاجة, تركيب, شحن الغاز' ),
		'metal' => array( 'الحديد والسودور', 'بيبان الحديد، شبابك، حماية، وخدمة السودور.', 'سودور, بيبان حديد, شبابك, حماية' ),
		'lock'  => array( 'البيبان والأمان', 'سرارة، مفاتيح، بيبان مدرعة، وأنظمة الأمان.', 'سرارة, مفاتيح, باب مدرع, كاميرا' ),
		'clean' => array( 'التنظيف والدار', 'تنظيف عميق، سالون، طابي، وخدمة الدار.', 'تنظيف عميق, سالون, طابي, زربية' ),
	);
}

/* -------------------------------------------------------------------------
 * Theme setup
 * ---------------------------------------------------------------------- */

add_action( 'after_setup_theme', 'm3allem_setup' );
function m3allem_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'style', 'script' ) );
	add_theme_support( 'automatic-feed-links' );
	add_image_size( 'm3allem-zone', 1400, 1050, true );
	add_image_size( 'm3allem-door', 1800, 1200, true );
	register_nav_menus( array( 'primary' => 'القائمة ديال فوق' ) );
	load_theme_textdomain( 'm3allem', get_template_directory() . '/languages' );
}

/* -------------------------------------------------------------------------
 * Content types
 * ---------------------------------------------------------------------- */

add_action( 'init', 'm3allem_register_types' );
function m3allem_register_types() {

	register_taxonomy(
		'hirfa',
		array( 'm3allem' ),
		array(
			'labels'            => array(
				'name'          => 'الحرف',
				'singular_name' => 'حرفة',
				'add_new_item'  => 'زيد حرفة جديدة',
				'edit_item'     => 'بدّل الحرفة',
			),
			'public'            => true,
			'hierarchical'      => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'rewrite'           => array( 'slug' => 'hirfa' ),
		)
	);

	register_post_type(
		'm3allem',
		array(
			'labels'        => array(
				'name'          => 'المعلّمية',
				'singular_name' => 'معلّم',
				'add_new_item'  => 'زيد معلّم جديد',
				'edit_item'     => 'بدّل المعلّم',
				'search_items'  => 'قلّب على معلّم',
				'not_found'     => 'ماكاين حتى معلّم.',
			),
			'public'        => true,
			'has_archive'   => true,
			'menu_icon'     => 'dashicons-hammer',
			'supports'      => array( 'title', 'editor', 'thumbnail', 'comments', 'author' ),
			'show_in_rest'  => true,
			'rewrite'       => array( 'slug' => 'm3allem' ),
			'taxonomies'    => array( 'hirfa' ),
			'menu_position' => 5,
		)
	);

	register_post_type(
		'talab',
		array(
			'labels'       => array(
				'name'          => 'المشاكل العاجلة',
				'singular_name' => 'مشكل عاجل',
			),
			'public'       => false,
			'show_ui'      => true,
			'menu_icon'    => 'dashicons-warning',
			'supports'     => array( 'title', 'editor', 'author' ),
			'show_in_rest' => false,
			'capability_type' => 'post',
		)
	);

	// Artisan-facing fields. Registered so the REST API and meta_query see them.
	$meta = array(
		'_m3_phone'    => 'string',
		'_m3_whatsapp' => 'string',
		'_m3_city'     => 'string',
		'_m3_lat'      => 'number',
		'_m3_lng'      => 'number',
		'_m3_verified' => 'boolean',
		'_m3_rating'   => 'number',
		'_m3_reviews'  => 'integer',
		'_m3_jobs'     => 'integer',
	);
	foreach ( $meta as $key => $type ) {
		register_post_meta(
			'm3allem',
			$key,
			array(
				'type'          => $type,
				'single'        => true,
				'show_in_rest'  => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}

/** Seed the craft terms once, so a fresh install already has the nine zones. */
add_action( 'after_switch_theme', 'm3allem_seed_crafts' );
function m3allem_seed_crafts() {
	foreach ( m3allem_default_crafts() as $slug => $data ) {
		if ( term_exists( $slug, 'hirfa' ) ) {
			continue;
		}
		$term = wp_insert_term( $data[0], 'hirfa', array( 'slug' => $slug, 'description' => $data[1] ) );
		if ( ! is_wp_error( $term ) ) {
			update_term_meta( $term['term_id'], '_m3_tags', $data[2] );
		}
	}
	flush_rewrite_rules();
}

/* -------------------------------------------------------------------------
 * Roles
 * ---------------------------------------------------------------------- */

add_action( 'after_switch_theme', 'm3allem_add_role' );
function m3allem_add_role() {
	add_role(
		'm3allem_pro',
		'معلّم',
		array(
			'read'                   => true,
			'upload_files'           => true,
			'edit_posts'             => true,
			'delete_posts'           => true,
			'edit_published_posts'   => true,
			'delete_published_posts' => true,
		)
	);
}

/** The artisan post that belongs to the current user, if any. */
function m3allem_my_profile( $user_id = 0 ) {
	$user_id = $user_id ? $user_id : get_current_user_id();
	if ( ! $user_id ) {
		return null;
	}
	$posts = get_posts(
		array(
			'post_type'      => 'm3allem',
			'author'         => $user_id,
			'post_status'    => array( 'publish', 'pending', 'draft' ),
			'posts_per_page' => 1,
		)
	);
	return $posts ? $posts[0] : null;
}

function m3allem_is_pro() {
	$user = wp_get_current_user();
	return $user && in_array( 'm3allem_pro', (array) $user->roles, true );
}

/* -------------------------------------------------------------------------
 * Reviews: a comment carries a 1–5 rating, the post caches the average
 * ---------------------------------------------------------------------- */

add_action( 'comment_post', 'm3allem_save_rating', 10, 2 );
function m3allem_save_rating( $comment_id, $approved ) {
	if ( isset( $_POST['m3_rating'] ) ) {
		$rating = max( 1, min( 5, (int) wp_unslash( $_POST['m3_rating'] ) ) );
		add_comment_meta( $comment_id, 'm3_rating', $rating, true );
	}
	if ( $approved ) {
		$comment = get_comment( $comment_id );
		m3allem_recount_rating( $comment->comment_post_ID );
	}
}

add_action( 'wp_set_comment_status', 'm3allem_rating_status_changed', 10, 2 );
function m3allem_rating_status_changed( $comment_id, $status ) {
	$comment = get_comment( $comment_id );
	if ( $comment ) {
		m3allem_recount_rating( $comment->comment_post_ID );
	}
}

function m3allem_recount_rating( $post_id ) {
	$comments = get_comments(
		array(
			'post_id' => $post_id,
			'status'  => 'approve',
			'type'    => 'comment',
		)
	);
	$sum   = 0;
	$count = 0;
	foreach ( $comments as $comment ) {
		$rating = (int) get_comment_meta( $comment->comment_ID, 'm3_rating', true );
		if ( $rating > 0 ) {
			$sum += $rating;
			$count++;
		}
	}
	update_post_meta( $post_id, '_m3_rating', $count ? round( $sum / $count, 1 ) : 0 );
	update_post_meta( $post_id, '_m3_reviews', $count );
}

/* -------------------------------------------------------------------------
 * Assets
 * ---------------------------------------------------------------------- */

add_action( 'wp_enqueue_scripts', 'm3allem_assets' );
function m3allem_assets() {
	wp_enqueue_style( 'm3allem-cairo', 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800;900&display=swap', array(), null );
	wp_enqueue_style( 'm3allem', get_stylesheet_uri(), array( 'm3allem-cairo' ), M3ALLEM_VERSION );

	wp_enqueue_script( 'm3allem', get_template_directory_uri() . '/assets/js/m3allem.js', array(), M3ALLEM_VERSION, true );
	wp_localize_script(
		'm3allem',
		'M3',
		array(
			'ajax'    => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'm3allem' ),
			'door'    => m3allem_door_image(),
			'handY'   => (float) get_theme_mod( 'm3_lock_y', 0.44 ),
			'handX'   => (float) get_theme_mod( 'm3_hands_x', 0.075 ),
			'zones'   => m3allem_zones_payload(),
			'loggedIn'=> is_user_logged_in(),
			'isPro'   => m3allem_is_pro(),
			'urls'    => array(
				'client' => home_url( '/client/' ),
				'pro'    => home_url( '/pro/' ),
				'login'  => wp_login_url(),
			),
		)
	);
}

/**
 * Starter artwork, so a fresh install already looks like something. Replace
 * both from Appearance → Customize → الباب ديال الدخول; uploading your own also
 * takes them off this remote host.
 */
const M3ALLEM_FALLBACK_DOOR = 'https://d8j0ntlcm91z4.cloudfront.net/user_38Z6iQ5SZ4Zbbv4qoOMfcP3gcAd/hf_20260814_125208_e33dcd54-174c-43ac-b092-1b6d038584f0.png';
const M3ALLEM_FALLBACK_HALL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38Z6iQ5SZ4Zbbv4qoOMfcP3gcAd/hf_20260814_125207_8cef3fed-40b3-4776-adb2-a58552c6235f.png';

/** Door photo: the customizer image if set, otherwise the starter one. */
function m3allem_door_image() {
	$id = (int) get_theme_mod( 'm3_door_image', 0 );
	if ( $id ) {
		$src = wp_get_attachment_image_src( $id, 'm3allem-door' );
		if ( $src ) {
			return $src[0];
		}
	}
	$local = get_template_directory() . '/assets/img/door.jpg';
	if ( file_exists( $local ) ) {
		return get_template_directory_uri() . '/assets/img/door.jpg';
	}
	return M3ALLEM_FALLBACK_DOOR;
}

function m3allem_hall_image() {
	$id = (int) get_theme_mod( 'm3_hall_image', 0 );
	if ( $id ) {
		$src = wp_get_attachment_image_src( $id, 'full' );
		if ( $src ) {
			return $src[0];
		}
	}
	$local = get_template_directory() . '/assets/img/hall.jpg';
	if ( file_exists( $local ) ) {
		return get_template_directory_uri() . '/assets/img/hall.jpg';
	}
	return M3ALLEM_FALLBACK_HALL;
}

/** Every craft term with its photo, blurb, artisan count and average rating. */
function m3allem_zones_payload() {
	$terms = get_terms(
		array(
			'taxonomy'   => 'hirfa',
			'hide_empty' => false,
			'orderby'    => 'term_order',
		)
	);
	if ( is_wp_error( $terms ) ) {
		return array();
	}

	$zones = array();
	foreach ( $terms as $term ) {
		$img_id = (int) get_term_meta( $term->term_id, '_m3_image', true );
		$img    = $img_id ? wp_get_attachment_image_url( $img_id, 'm3allem-zone' ) : '';
		if ( ! $img ) {
			$img = m3allem_fallback_zone_image( $term->slug );
		}
		$tags = (string) get_term_meta( $term->term_id, '_m3_tags', true );

		$zones[] = array(
			'id'     => $term->slug,
			'n'      => $term->name,
			'd'      => $term->description,
			'img'    => $img,
			'tags'   => array_values( array_filter( array_map( 'trim', explode( ',', $tags ) ) ) ),
			'pros'   => (int) $term->count,
			'rate'   => m3allem_term_rating( $term->term_id ),
			'link'   => get_term_link( $term ),
			// Drawn in the theme, so a zone is never empty for want of a photo.
			'hue'    => m3allem_hue( $term->slug ),
			'figure' => m3allem_figure( $term->slug ),
			'emblem' => m3allem_emblem( $term->slug ),
		);
	}
	return $zones;
}

/** Average rating across every published artisan on the site. */
function m3allem_site_rating() {
	$posts = get_posts(
		array(
			'post_type'      => 'm3allem',
			'posts_per_page' => -1,
			'fields'         => 'ids',
		)
	);
	$sum   = 0;
	$count = 0;
	foreach ( $posts as $id ) {
		$rating = (float) get_post_meta( $id, '_m3_rating', true );
		if ( $rating > 0 ) {
			$sum += $rating;
			$count++;
		}
	}
	return $count ? round( $sum / $count, 1 ) : '—';
}

function m3allem_term_rating( $term_id ) {
	$posts = get_posts(
		array(
			'post_type'      => 'm3allem',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'tax_query'      => array(
				array(
					'taxonomy' => 'hirfa',
					'field'    => 'term_id',
					'terms'    => $term_id,
				),
			),
		)
	);
	$sum   = 0;
	$count = 0;
	foreach ( $posts as $id ) {
		$rating = (float) get_post_meta( $id, '_m3_rating', true );
		if ( $rating > 0 ) {
			$sum += $rating;
			$count++;
		}
	}
	return $count ? round( $sum / $count, 1 ) : 0;
}

/** One artisan, shaped for the front-end card. */
function m3allem_card( $post ) {
	$terms = get_the_terms( $post, 'hirfa' );
	$term  = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0] : null;
	$thumb = get_the_post_thumbnail_url( $post, 'medium' );

	if ( ! $thumb && $term ) {
		$img_id = (int) get_term_meta( $term->term_id, '_m3_image', true );
		$thumb  = $img_id ? wp_get_attachment_image_url( $img_id, 'medium' ) : '';
		if ( ! $thumb ) {
			$thumb = m3allem_fallback_zone_image( $term->slug );
		}
	}

	return array(
		'id'    => $post->ID,
		'n'     => get_the_title( $post ),
		'c'     => $term ? $term->slug : '',
		'cn'    => $term ? $term->name : '',
		'city'  => (string) get_post_meta( $post->ID, '_m3_city', true ),
		'r'     => (float) get_post_meta( $post->ID, '_m3_rating', true ),
		'k'     => (int) get_post_meta( $post->ID, '_m3_reviews', true ),
		'v'     => (bool) get_post_meta( $post->ID, '_m3_verified', true ),
		't'     => (string) get_post_meta( $post->ID, '_m3_phone', true ),
		'wa'    => (string) get_post_meta( $post->ID, '_m3_whatsapp', true ),
		'img'   => $thumb,
		'link'  => get_permalink( $post ),
	);
}

require_once get_template_directory() . '/inc/emblems.php';
require_once get_template_directory() . '/inc/meta-boxes.php';
require_once get_template_directory() . '/inc/ajax.php';
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/pwa.php';
