<?php
/**
 * Customizer: the door photo, the hall photo, and where the padlock sits.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

add_action( 'customize_register', 'm3allem_customize' );
function m3allem_customize( $wp_customize ) {

	$wp_customize->add_section(
		'm3_gate',
		array(
			'title'       => 'الباب ديال الدخول',
			'priority'    => 20,
			'description' => 'التصويرة ديال الباب كتتقسم على جوج دفوف. خاصها تكون مصوّرة من قدّام وموازية، والقفل فالوسط.',
		)
	);

	$wp_customize->add_setting( 'm3_door_image', array( 'sanitize_callback' => 'absint' ) );
	$wp_customize->add_control(
		new WP_Customize_Media_Control(
			$wp_customize,
			'm3_door_image',
			array(
				'label'     => 'التصويرة ديال الباب',
				'section'   => 'm3_gate',
				'mime_type' => 'image',
			)
		)
	);

	$wp_customize->add_setting( 'm3_hall_image', array( 'sanitize_callback' => 'absint' ) );
	$wp_customize->add_control(
		new WP_Customize_Media_Control(
			$wp_customize,
			'm3_hall_image',
			array(
				'label'     => 'التصويرة ديال الداخل',
				'section'   => 'm3_gate',
				'mime_type' => 'image',
			)
		)
	);

	// Where the padlock sits in the photo, top to bottom, as a fraction.
	$wp_customize->add_setting(
		'm3_lock_y',
		array(
			'default'           => 0.655,
			'sanitize_callback' => 'm3allem_sanitize_fraction',
		)
	);
	$wp_customize->add_control(
		'm3_lock_y',
		array(
			'label'       => 'بلاصة القفل (من فوق لتحت)',
			'description' => 'من 0 حتى 1. إلا الدائرة ماجاتش على القفل، بدّل هاد الرقم.',
			'section'     => 'm3_gate',
			'type'        => 'number',
			'input_attrs' => array(
				'min'  => 0,
				'max'  => 1,
				'step' => 0.005,
			),
		)
	);
}

function m3allem_sanitize_fraction( $value ) {
	$value = (float) $value;
	return max( 0, min( 1, $value ) );
}
