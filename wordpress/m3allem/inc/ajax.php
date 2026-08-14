<?php
/**
 * Front-end endpoints: artisan search, urgent requests, artisan sign-up.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

/** Both handlers are open to logged-out visitors — searching needs no account. */
add_action( 'wp_ajax_m3_search', 'm3allem_ajax_search' );
add_action( 'wp_ajax_nopriv_m3_search', 'm3allem_ajax_search' );
function m3allem_ajax_search() {
	check_ajax_referer( 'm3allem', 'nonce' );

	$q     = isset( $_POST['q'] ) ? sanitize_text_field( wp_unslash( $_POST['q'] ) ) : '';
	$craft = isset( $_POST['craft'] ) ? sanitize_key( $_POST['craft'] ) : '';
	$city  = isset( $_POST['city'] ) ? sanitize_text_field( wp_unslash( $_POST['city'] ) ) : '';

	$args = array(
		'post_type'      => 'm3allem',
		'post_status'    => 'publish',
		'posts_per_page' => 40,
		'meta_key'       => '_m3_rating',
		'orderby'        => array( 'meta_value_num' => 'DESC', 'date' => 'DESC' ),
	);

	if ( $q ) {
		$args['s'] = $q;
	}
	if ( $craft ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'hirfa',
				'field'    => 'slug',
				'terms'    => $craft,
			),
		);
	}
	if ( $city ) {
		$args['meta_query'] = array(
			array(
				'key'     => '_m3_city',
				'value'   => $city,
				'compare' => 'LIKE',
			),
		);
	}

	$query = new WP_Query( $args );
	$out   = array();
	foreach ( $query->posts as $post ) {
		$out[] = m3allem_card( $post );
	}
	wp_send_json_success( $out );
}

/** A client publishes an urgent problem. */
add_action( 'wp_ajax_m3_urgent', 'm3allem_ajax_urgent' );
add_action( 'wp_ajax_nopriv_m3_urgent', 'm3allem_ajax_urgent' );
function m3allem_ajax_urgent() {
	check_ajax_referer( 'm3allem', 'nonce' );

	$body = isset( $_POST['body'] ) ? sanitize_textarea_field( wp_unslash( $_POST['body'] ) ) : '';
	$city = isset( $_POST['city'] ) ? sanitize_text_field( wp_unslash( $_POST['city'] ) ) : '';
	$tel  = isset( $_POST['tel'] ) ? sanitize_text_field( wp_unslash( $_POST['tel'] ) ) : '';

	if ( strlen( $body ) < 8 ) {
		wp_send_json_error( array( 'msg' => 'كتب المشكل ديالك بتفصيل شوية.' ) );
	}
	if ( ! $tel && ! is_user_logged_in() ) {
		wp_send_json_error( array( 'msg' => 'خصنا التيليفون ديالك باش المعلّم يقدر يتواصل معاك.' ) );
	}

	$id = wp_insert_post(
		array(
			'post_type'    => 'talab',
			'post_status'  => 'publish',
			'post_title'   => wp_trim_words( $body, 9, '…' ),
			'post_content' => $body,
			'post_author'  => get_current_user_id(),
		),
		true
	);

	if ( is_wp_error( $id ) ) {
		wp_send_json_error( array( 'msg' => 'وقع شي مشكل، عاود من بعد.' ) );
	}

	update_post_meta( $id, '_m3_city', $city );
	update_post_meta( $id, '_m3_phone', $tel );

	wp_send_json_success( array( 'msg' => 'تنشر! غادي يوصل للمعلّمية القريبين منك ⚡' ) );
}

/** An artisan registers: a user plus a pending profile an admin reviews. */
add_action( 'admin_post_nopriv_m3_signup', 'm3allem_signup' );
add_action( 'admin_post_m3_signup', 'm3allem_signup' );
function m3allem_signup() {
	check_admin_referer( 'm3_signup' );

	$name  = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$tel   = isset( $_POST['tel'] ) ? sanitize_text_field( wp_unslash( $_POST['tel'] ) ) : '';
	$city  = isset( $_POST['city'] ) ? sanitize_text_field( wp_unslash( $_POST['city'] ) ) : '';
	$craft = isset( $_POST['craft'] ) ? sanitize_key( $_POST['craft'] ) : '';
	$pass  = isset( $_POST['pass'] ) ? (string) wp_unslash( $_POST['pass'] ) : '';

	$back = wp_get_referer() ? wp_get_referer() : home_url( '/' );

	if ( ! $name || ! is_email( $email ) || ! $tel || strlen( $pass ) < 6 ) {
		wp_safe_redirect( add_query_arg( 'm3', 'bad', $back ) );
		exit;
	}
	if ( email_exists( $email ) ) {
		wp_safe_redirect( add_query_arg( 'm3', 'dup', $back ) );
		exit;
	}

	$user_id = wp_insert_user(
		array(
			'user_login'   => $email,
			'user_email'   => $email,
			'user_pass'    => $pass,
			'display_name' => $name,
			'role'         => 'm3allem_pro',
		)
	);
	if ( is_wp_error( $user_id ) ) {
		wp_safe_redirect( add_query_arg( 'm3', 'bad', $back ) );
		exit;
	}

	$post_id = wp_insert_post(
		array(
			'post_type'   => 'm3allem',
			'post_status' => 'pending',
			'post_title'  => $name,
			'post_author' => $user_id,
		)
	);
	if ( ! is_wp_error( $post_id ) ) {
		update_post_meta( $post_id, '_m3_phone', $tel );
		update_post_meta( $post_id, '_m3_city', $city );
		if ( $craft ) {
			wp_set_object_terms( $post_id, $craft, 'hirfa' );
		}
	}

	wp_set_current_user( $user_id );
	wp_set_auth_cookie( $user_id );
	wp_safe_redirect( home_url( '/pro/' ) );
	exit;
}

/** An artisan updates their own profile from the dashboard. */
add_action( 'admin_post_m3_save_profile', 'm3allem_save_profile' );
function m3allem_save_profile() {
	check_admin_referer( 'm3_profile' );

	$profile = m3allem_my_profile();
	if ( ! $profile ) {
		wp_safe_redirect( home_url( '/pro/' ) );
		exit;
	}

	$content = isset( $_POST['bio'] ) ? sanitize_textarea_field( wp_unslash( $_POST['bio'] ) ) : '';
	wp_update_post(
		array(
			'ID'           => $profile->ID,
			'post_content' => $content,
		)
	);

	foreach ( array( '_m3_phone', '_m3_whatsapp', '_m3_city' ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $profile->ID, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
	if ( isset( $_POST['craft'] ) && $_POST['craft'] ) {
		wp_set_object_terms( $profile->ID, sanitize_key( $_POST['craft'] ), 'hirfa' );
	}

	wp_safe_redirect( add_query_arg( 'm3', 'saved', home_url( '/pro/' ) ) );
	exit;
}
