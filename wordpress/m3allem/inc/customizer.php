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

	// Where the knockers sit in the photo, as fractions of its width/height.
	$wp_customize->add_setting(
		'm3_hands_x',
		array(
			'default'           => 0.075,
			'sanitize_callback' => 'm3allem_sanitize_fraction',
		)
	);
	$wp_customize->add_control(
		'm3_hands_x',
		array(
			'label'       => 'البعد بين اليدّين',
			'description' => 'شحال كل يد بعيدة على الوسط. من 0 حتى 0.5.',
			'section'     => 'm3_gate',
			'type'        => 'number',
			'input_attrs' => array( 'min' => 0, 'max' => 0.5, 'step' => 0.005 ),
		)
	);

	$wp_customize->add_setting(
		'm3_lock_y',
		array(
			'default'           => 0.44,
			'sanitize_callback' => 'm3allem_sanitize_fraction',
		)
	);
	$wp_customize->add_control(
		'm3_lock_y',
		array(
			'label'       => 'بلاصة اليدّين (من فوق لتحت)',
			'description' => 'من 0 حتى 1. إلا الدوائر ماجاوش على اليدّين ديال النحاس، بدّل هاد الرقم.',
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

add_action( 'customize_register', 'm3allem_customize_app' );
function m3allem_customize_app( $wp_customize ) {

	$wp_customize->add_section(
		'm3_app',
		array(
			'title'       => 'الأبليكاسيون (PWA)',
			'priority'    => 21,
			'description' => 'هاد الإعدادات كيتحكمو فاش الموقع كيتزاد فالتيليفون، وفـالـAPK ديال أندرويد.',
		)
	);

	$wp_customize->add_setting(
		'm3_app_short_name',
		array(
			'default'           => 'المعلّم',
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'm3_app_short_name',
		array(
			'label'       => 'السمية القصيرة',
			'description' => 'لي كتبان تحت الأيقونة فالتيليفون. خليها قصيرة.',
			'section'     => 'm3_app',
			'type'        => 'text',
		)
	);

	$wp_customize->add_setting( 'm3_app_icon', array( 'sanitize_callback' => 'absint' ) );
	$wp_customize->add_control(
		new WP_Customize_Media_Control(
			$wp_customize,
			'm3_app_icon',
			array(
				'label'       => 'الأيقونة ديال الأبليكاسيون',
				'description' => 'مربّعة 512×512 على الأقل. خلي الرسم فالوسط حيت أندرويد كيقص الأطراف.',
				'section'     => 'm3_app',
				'mime_type'   => 'image',
			)
		)
	);
}

function m3allem_sanitize_fraction( $value ) {
	$value = (float) $value;
	return max( 0, min( 1, $value ) );
}
