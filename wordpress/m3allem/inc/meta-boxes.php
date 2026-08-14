<?php
/**
 * Admin fields for artisans and craft terms — no plugin required.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

/* ------------------------------------------------------------------ *
 * Artisan fields
 * ------------------------------------------------------------------ */

add_action( 'add_meta_boxes', 'm3allem_meta_box' );
function m3allem_meta_box() {
	add_meta_box( 'm3allem_details', 'المعلومات ديال المعلّم', 'm3allem_meta_box_render', 'm3allem', 'normal', 'high' );
}

function m3allem_meta_box_render( $post ) {
	wp_nonce_field( 'm3allem_meta', 'm3allem_meta_nonce' );

	$fields = array(
		'_m3_phone'    => array( 'التيليفون', 'tel', 'مثلا 0661234567' ),
		'_m3_whatsapp' => array( 'واتساب (إلا كان مختلف)', 'tel', '212661234567' ),
		'_m3_city'     => array( 'المدينة', 'text', 'الدار البيضاء' ),
		'_m3_lat'      => array( 'خط العرض (latitude)', 'text', '33.5731' ),
		'_m3_lng'      => array( 'خط الطول (longitude)', 'text', '-7.5898' ),
		'_m3_jobs'     => array( 'الخدمات المكمّلة', 'number', '0' ),
	);

	echo '<style>.m3-f{margin:12px 0}.m3-f label{display:block;font-weight:600;margin-bottom:4px}.m3-f input{width:100%;max-width:420px}</style>';

	foreach ( $fields as $key => $f ) {
		printf(
			'<p class="m3-f"><label for="%1$s">%2$s</label><input type="%3$s" id="%1$s" name="%1$s" value="%4$s" placeholder="%5$s"></p>',
			esc_attr( $key ),
			esc_html( $f[0] ),
			esc_attr( $f[1] ),
			esc_attr( get_post_meta( $post->ID, $key, true ) ),
			esc_attr( $f[2] )
		);
	}

	printf(
		'<p class="m3-f"><label><input type="checkbox" name="_m3_verified" value="1" %s> معلّم موثّق ✓ (صيفط الكارط الوطنية وتشيّكات)</label></p>',
		checked( get_post_meta( $post->ID, '_m3_verified', true ), '1', false )
	);

	$rating  = (float) get_post_meta( $post->ID, '_m3_rating', true );
	$reviews = (int) get_post_meta( $post->ID, '_m3_reviews', true );
	printf(
		'<p style="opacity:.7">النقطة: <strong>%s</strong> من <strong>%d</strong> تقييم — كتّحسب أوتوماتيكيا من التعليقات.</p>',
		esc_html( $rating ? $rating : '—' ),
		(int) $reviews
	);
}

add_action( 'save_post_m3allem', 'm3allem_meta_save' );
function m3allem_meta_save( $post_id ) {
	if ( ! isset( $_POST['m3allem_meta_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['m3allem_meta_nonce'] ), 'm3allem_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	foreach ( array( '_m3_phone', '_m3_whatsapp', '_m3_city', '_m3_lat', '_m3_lng', '_m3_jobs' ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
	update_post_meta( $post_id, '_m3_verified', isset( $_POST['_m3_verified'] ) ? '1' : '' );
}

/* ------------------------------------------------------------------ *
 * Craft term fields: the zone photo and its chips
 * ------------------------------------------------------------------ */

add_action( 'hirfa_add_form_fields', 'm3allem_term_add_fields' );
function m3allem_term_add_fields() {
	echo '<div class="form-field"><label for="_m3_tags">الخدمات (مفصولين بفاصلة)</label>';
	echo '<input type="text" name="_m3_tags" id="_m3_tags" value=""></div>';
	echo '<div class="form-field"><label for="_m3_image">ID ديال الصورة</label>';
	echo '<input type="number" name="_m3_image" id="_m3_image" value="">';
	echo '<p>تالع الصورة فالمكتبة وحط الـID ديالها هنا.</p></div>';
}

add_action( 'hirfa_edit_form_fields', 'm3allem_term_edit_fields' );
function m3allem_term_edit_fields( $term ) {
	$tags = get_term_meta( $term->term_id, '_m3_tags', true );
	$img  = get_term_meta( $term->term_id, '_m3_image', true );

	echo '<tr class="form-field"><th><label for="_m3_tags">الخدمات (مفصولين بفاصلة)</label></th><td>';
	printf( '<input type="text" name="_m3_tags" id="_m3_tags" value="%s"></td></tr>', esc_attr( $tags ) );

	echo '<tr class="form-field"><th><label for="_m3_image">ID ديال الصورة</label></th><td>';
	printf( '<input type="number" name="_m3_image" id="_m3_image" value="%s">', esc_attr( $img ) );
	if ( $img ) {
		$src = wp_get_attachment_image_url( (int) $img, 'medium' );
		if ( $src ) {
			printf( '<br><img src="%s" alt="" style="max-width:280px;margin-top:10px;border-radius:8px">', esc_url( $src ) );
		}
	}
	echo '</td></tr>';
}

add_action( 'created_hirfa', 'm3allem_term_save' );
add_action( 'edited_hirfa', 'm3allem_term_save' );
function m3allem_term_save( $term_id ) {
	if ( ! current_user_can( 'manage_categories' ) ) {
		return;
	}
	if ( isset( $_POST['_m3_tags'] ) ) {
		update_term_meta( $term_id, '_m3_tags', sanitize_text_field( wp_unslash( $_POST['_m3_tags'] ) ) );
	}
	if ( isset( $_POST['_m3_image'] ) ) {
		update_term_meta( $term_id, '_m3_image', (int) $_POST['_m3_image'] );
	}
}

/* ------------------------------------------------------------------ *
 * Rating field on the review form and in the comment list
 * ------------------------------------------------------------------ */

add_filter( 'comment_form_defaults', 'm3allem_comment_form_rating' );
function m3allem_comment_form_rating( $defaults ) {
	if ( 'm3allem' !== get_post_type() ) {
		return $defaults;
	}
	$stars = '<p class="m3-rate"><label>النقطة ديالك</label><span class="m3-stars-in">';
	for ( $i = 5; $i >= 1; $i-- ) {
		$stars .= sprintf(
			'<input type="radio" id="m3r%1$d" name="m3_rating" value="%1$d" required><label for="m3r%1$d" title="%1$d">★</label>',
			$i
		);
	}
	$stars                     .= '</span></p>';
	$defaults['comment_field'] = $stars . $defaults['comment_field'];
	$defaults['title_reply']   = 'كتب تقييم';
	$defaults['label_submit']  = 'صيفط التقييم';
	return $defaults;
}
