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

	$lat    = isset( $_POST['lat'] ) ? (float) $_POST['lat'] : null;
	$lng    = isset( $_POST['lng'] ) ? (float) $_POST['lng'] : null;
	$radius = isset( $_POST['radius'] ) ? (float) $_POST['radius'] : 0;
	$geo    = ( null !== $lat && null !== $lng && ( $lat || $lng ) );

	// With a location we rank by distance, so pull the whole set and sort here.
	if ( $geo ) {
		$args['posts_per_page'] = 200;
	}

	$query = new WP_Query( $args );
	$out   = array();

	foreach ( $query->posts as $post ) {
		$card = m3allem_card( $post );

		if ( $geo ) {
			$plat = (float) get_post_meta( $post->ID, '_m3_lat', true );
			$plng = (float) get_post_meta( $post->ID, '_m3_lng', true );
			if ( ! $plat && ! $plng ) {
				continue; // no coordinates, so it cannot be ranked by distance
			}
			$km = m3allem_distance_km( $lat, $lng, $plat, $plng );
			if ( $radius > 0 && $km > $radius ) {
				continue;
			}
			$card['km'] = round( $km, 2 );
		}

		$out[] = $card;
	}

	if ( $geo ) {
		usort(
			$out,
			function ( $a, $b ) {
				return $a['km'] <=> $b['km'];
			}
		);
		$out = array_slice( $out, 0, 40 );
	}

	wp_send_json_success( $out );
}

/** Great-circle distance in kilometres. */
function m3allem_distance_km( $lat1, $lon1, $lat2, $lon2 ) {
	$earth = 6371.0088;
	$dlat  = deg2rad( $lat2 - $lat1 );
	$dlon  = deg2rad( $lon2 - $lon1 );
	$a     = sin( $dlat / 2 ) ** 2
		+ cos( deg2rad( $lat1 ) ) * cos( deg2rad( $lat2 ) ) * sin( $dlon / 2 ) ** 2;
	return $earth * 2 * asin( min( 1.0, sqrt( $a ) ) );
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

/**
 * An artisan asks to join. No account and no password: this only files a
 * pending profile for an admin to review, so signing up costs the artisan
 * nothing more than their phone number.
 */
add_action( 'admin_post_nopriv_m3_signup', 'm3allem_signup' );
add_action( 'admin_post_m3_signup', 'm3allem_signup' );
function m3allem_signup() {
	check_admin_referer( 'm3_signup' );

	$name  = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$tel   = isset( $_POST['tel'] ) ? sanitize_text_field( wp_unslash( $_POST['tel'] ) ) : '';
	$city  = isset( $_POST['city'] ) ? sanitize_text_field( wp_unslash( $_POST['city'] ) ) : '';
	$craft = isset( $_POST['craft'] ) ? sanitize_key( $_POST['craft'] ) : '';
	$bio   = isset( $_POST['bio'] ) ? sanitize_textarea_field( wp_unslash( $_POST['bio'] ) ) : '';
	$lat   = isset( $_POST['lat'] ) ? (float) $_POST['lat'] : 0;
	$lng   = isset( $_POST['lng'] ) ? (float) $_POST['lng'] : 0;

	$back = home_url( '/pro/' );

	if ( ! $name || ! $tel || ! $craft ) {
		wp_safe_redirect( add_query_arg( 'm3', 'bad', $back ) );
		exit;
	}

	// Same phone already waiting or listed? Don't file it twice.
	$dupe = get_posts(
		array(
			'post_type'      => 'm3allem',
			'post_status'    => array( 'publish', 'pending', 'draft' ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'   => '_m3_phone',
					'value' => $tel,
				),
			),
		)
	);
	if ( $dupe ) {
		wp_safe_redirect( add_query_arg( 'm3', 'dup', $back ) );
		exit;
	}

	$post_id = wp_insert_post(
		array(
			'post_type'    => 'm3allem',
			'post_status'  => 'pending',
			'post_title'   => $name,
			'post_content' => $bio,
		),
		true
	);
	if ( is_wp_error( $post_id ) ) {
		wp_safe_redirect( add_query_arg( 'm3', 'bad', $back ) );
		exit;
	}

	update_post_meta( $post_id, '_m3_phone', $tel );
	update_post_meta( $post_id, '_m3_city', $city );
	if ( $lat && $lng ) {
		update_post_meta( $post_id, '_m3_lat', $lat );
		update_post_meta( $post_id, '_m3_lng', $lng );
	}
	wp_set_object_terms( $post_id, $craft, 'hirfa' );

	wp_safe_redirect( add_query_arg( 'm3', 'thanks', $back ) );
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
