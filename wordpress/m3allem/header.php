<?php
/**
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<?php wp_head(); ?>
</head>
<body <?php body_class( is_front_page() ? 'locked' : 'entered in-app' ); ?>>
<?php wp_body_open(); ?>

<header>
	<a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
		<i>م</i> <?php bloginfo( 'name' ); ?><span>.</span>
	</a>
	<nav>
		<?php if ( is_front_page() ) : ?>
			<button class="nb hide-s" data-nav="tour">الجولة</button>
			<button class="nb hide-s" data-nav="choose">دخل</button>
		<?php endif; ?>
		<a class="nb" href="<?php echo esc_url( home_url( '/client/' ) ); ?>">كليان</a>
		<a class="nb" href="<?php echo esc_url( home_url( '/pro/' ) ); ?>">معلّم</a>
		<?php if ( is_user_logged_in() ) : ?>
			<a class="nb" href="<?php echo esc_url( wp_logout_url( home_url( '/' ) ) ); ?>">خروج</a>
		<?php endif; ?>
	</nav>
</header>
