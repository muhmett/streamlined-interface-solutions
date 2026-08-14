<?php
/**
 * The gate, then the walkthrough over every craft zone.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

get_header();

$zones = m3allem_zones_payload();
$hall  = m3allem_hall_image();
$total = wp_count_posts( 'm3allem' );
$total = $total ? (int) $total->publish : 0;
?>

<section id="gate" aria-label="باب الدخول">
	<div class="behind"><img src="<?php echo esc_url( $hall ); ?>" alt=""></div>
	<div class="glow"></div>
	<div class="dust" id="dust"></div>

	<div class="leaf l"><div class="tex"></div></div>
	<div class="leaf r"><div class="tex"></div></div>

	<div class="brandmark">
		<h1><?php bloginfo( 'name' ); ?><span>.</span></h1>
		<p>M3ALLEM</p>
	</div>

	<?php // Each brass knocker is a door of its own — JS lands them on the photo. ?>
	<button class="hand" id="hand-client" data-role="client" aria-label="دخل كـكليان">
		<span class="halo"></span>
		<span class="tip">أنا <b>كليان</b></span>
	</button>
	<button class="hand" id="hand-pro" data-role="pro" aria-label="دخل كـمعلّم">
		<span class="halo"></span>
		<span class="tip">أنا <b>معلّم</b></span>
	</button>

	<div class="hint" id="hint">
		<b>دقّ على اليد ديالك باش يتحل الباب</b>
		<small>وحدة للكليان، ووحدة للمعلّم</small>
		<div class="arrow"></div>
	</div>
</section>

<div class="rail" id="rail"></div>

<main id="top">

	<?php
	// You are standing at the door looking in: storeys recede in real 3D and
	// each side of a storey is one craft. JS builds them from the terms above.
	?>
	<section class="lobby" id="tour">
		<div class="stage">
			<div class="scene" id="scene"></div>
			<div class="gateframe"></div>
		</div>
	</section>

	<div class="hud" id="hud">
		<div class="lvl" id="hudLvl"></div>
		<div class="nm" id="hudName"></div>
		<div class="go"><a class="btn gold" id="hudGo" href="#">شوف المعلّمية ←</a></div>
	</div>

	<section class="hall" id="intro">
		<div class="bg"><img src="<?php echo esc_url( $hall ); ?>" alt="" loading="lazy"></div>
		<div class="in">
			<span class="eyebrow rv">داخل البناية</span>
			<h2 class="rv d1"><?php echo wp_kses_post( get_theme_mod( 'm3_headline', 'بناية وحدة، <em>وكل طبقة صنعة</em>' ) ); ?></h2>
			<p class="rv d2"><?php echo esc_html( get_bloginfo( 'description' ) ? get_bloginfo( 'description' ) : 'هنا كتلقى المعلّمية ديال كل حرفة، مرتّبين كل واحد فالزون ديالو. تجول، شوف الخدمة ديالهم، وتواصل معاهم نيشان — بلا وسيط وبلا صداع.' ); ?></p>
			<div class="cta rv d3">
				<button class="btn gold" data-nav="z1">كمّل الجولة ↓</button>
				<a class="btn ghost" href="<?php echo esc_url( home_url( '/client/' ) ); ?>">قلّب على معلّم</a>
			</div>
			<div class="stats rv d4">
				<div class="stat"><b><?php echo (int) count( $zones ); ?></b><span>زونات ديال الحرف</span></div>
				<div class="stat"><b><?php echo esc_html( number_format_i18n( $total ) ); ?></b><span>معلّم مسجّل</span></div>
				<div class="stat"><b><?php echo esc_html( m3allem_site_rating() ); ?></b><span>معدل التقييم</span></div>
			</div>
		</div>
	</section>

	<div id="zones">
	<?php foreach ( $zones as $i => $z ) : ?>
		<section class="zone" id="z<?php echo (int) ( $i + 1 ); ?>" data-zone="<?php echo esc_attr( $z['id'] ); ?>">
			<div class="pic">
				<?php if ( $z['img'] ) : ?>
					<img src="<?php echo esc_url( $z['img'] ); ?>" alt="<?php echo esc_attr( $z['n'] ); ?>" loading="lazy">
				<?php endif; ?>
			</div>
			<div class="veil"></div><div class="veil2"></div>
			<div class="body">
				<div class="znum rv">زون <?php echo esc_html( str_pad( $i + 1, 2, '0', STR_PAD_LEFT ) ); ?> / <?php echo esc_html( str_pad( count( $zones ), 2, '0', STR_PAD_LEFT ) ); ?></div>
				<h3 class="rv d1"><?php echo esc_html( $z['n'] ); ?></h3>
				<?php if ( $z['d'] ) : ?>
					<p class="desc rv d2"><?php echo esc_html( $z['d'] ); ?></p>
				<?php endif; ?>
				<?php if ( $z['tags'] ) : ?>
					<div class="chips rv d2">
						<?php foreach ( $z['tags'] as $tag ) : ?>
							<span class="chip"><?php echo esc_html( $tag ); ?></span>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
				<div class="zmeta rv d3">
					<div><b><?php echo (int) $z['pros']; ?></b><span>معلّم فهاد الزون</span></div>
					<div><b><?php echo esc_html( $z['rate'] ? $z['rate'] : '—' ); ?></b><span>معدل التقييم</span></div>
				</div>
				<div class="go rv d4">
					<a class="btn gold" href="<?php echo esc_url( add_query_arg( 'hirfa', $z['id'], home_url( '/client/' ) ) ); ?>">
						شوف المعلّمية ديال هاد الزون ←
					</a>
				</div>
			</div>
		</section>
	<?php endforeach; ?>
	</div>

	<section class="choose" id="choose">
		<div class="wrap">
			<h2 class="rv">شكون نتا؟</h2>
			<p class="rv d1">كل واحد عندو الواجهة ديالو. اختار وسير.</p>
			<div class="roles">
				<a class="role rv d2" href="<?php echo esc_url( home_url( '/client/' ) ); ?>">
					<span class="ic">👤</span>
					<h3>أنا كليان</h3>
					<p>باغي شي معلّم يصاوب ليا شي حاجة فالدار، بسرعة وبثقة.</p>
					<ul>
						<li>قلّب على معلّم بالحرفة والمدينة</li>
						<li>عيّط ليه نيشان ولا واتساب</li>
						<li>نشر مشكل عاجل ويجيوك العروض</li>
						<li>كتب تقييم من بعد الخدمة</li>
					</ul>
					<div class="arrow">دخل للواجهة ديال الكليان ←</div>
				</a>
				<a class="role rv d3" href="<?php echo esc_url( home_url( '/pro/' ) ); ?>">
					<span class="ic">🛠️</span>
					<h3>أنا معلّم</h3>
					<p>باغي البلاصة ديالي فالزون ديال الصنعة ديالي، والناس تلقاني.</p>
					<ul>
						<li>سجّل وبان للناس فالزون ديالك</li>
						<li>شوف المشاكل العاجلة القريبة منك</li>
						<li>بوسطي الخدمة ديالك بحال انسطا</li>
						<li>شارة «موثّق» من بعد ما تصيفط الكارط</li>
					</ul>
					<div class="arrow">دخل للواجهة ديال المعلّم ←</div>
				</a>
			</div>
		</div>
	</section>
</main>

<?php get_footer(); ?>
