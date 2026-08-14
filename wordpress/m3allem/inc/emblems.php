<?php
/**
 * Built-in artwork, so a craft zone looks finished before anyone uploads a photo.
 *
 * Every craft gets a hue, a carved artisan figure holding its own tool, and a
 * tool emblem used as a watermark. All inline SVG: no files, no requests.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

/** Signature hue per craft, used for the gradient and the zellige pattern. */
function m3allem_hues() {
	return array(
		'plumb' => 202,
		'elec'  => 45,
		'wood'  => 26,
		'paint' => 150,
		'tile'  => 276,
		'cool'  => 188,
		'metal' => 14,
		'lock'  => 222,
		'clean' => 166,
	);
}

function m3allem_hue( $slug ) {
	$hues = m3allem_hues();
	if ( isset( $hues[ $slug ] ) ) {
		return $hues[ $slug ];
	}
	// Stable hue for any craft the site owner adds later.
	return abs( crc32( $slug ) ) % 360;
}

/**
 * The tool each figure holds, drawn in the raised hand's coordinate space
 * (roughly x 108-190, y 40-150 of a 220x340 viewBox).
 */
function m3allem_tool_path( $slug ) {
	$tools = array(
		// pipe wrench + drop
		'plumb' => '<path d="M150 52c10 0 18 8 18 18 0 6-3 11-7 14l0 52c0 6-5 11-11 11s-11-5-11-11l0-52c-4-3-7-8-7-14 0-10 8-18 18-18zm0 12a6 6 0 100 12 6 6 0 000-12z"/>
			<path d="M132 132c-8 10-13 18-13 25a13 13 0 0026 0c0-7-5-15-13-25z" opacity=".85"/>',
		// lightning bolt
		'elec'  => '<path d="M158 44l-38 62h26l-14 56 42-68h-28l12-50z"/>
			<circle cx="146" cy="150" r="8" opacity=".7"/>',
		// hand saw
		'wood'  => '<path d="M120 60l58 22-6 16-58-22z"/>
			<path d="M114 94l58 22-4 12-58-22z" opacity=".9"/>
			<path d="M112 122l56 21-3 9-56-21z" opacity=".55"/>
			<rect x="106" y="52" width="14" height="34" rx="5"/>',
		// paint roller
		'paint' => '<rect x="118" y="46" width="56" height="26" rx="9"/>
			<path d="M146 72v22h-18a10 10 0 00-10 10v42h14v-38h28a10 10 0 0010-10V72z" opacity=".9"/>',
		// trowel + tile
		'tile'  => '<path d="M118 52h60l-30 62z"/>
			<rect x="140" y="112" width="14" height="38" rx="6" opacity=".9"/>
			<path d="M112 128l18-18 18 18-18 18z" opacity=".55"/>',
		// snowflake
		'cool'  => '<path d="M146 40v112M100 72l92 48M192 72l-92 48" stroke="currentColor" stroke-width="12" stroke-linecap="round" fill="none"/>
			<path d="M146 62l-14-14M146 62l14-14M146 130l-14 14M146 130l14 14" stroke="currentColor" stroke-width="9" stroke-linecap="round" fill="none"/>',
		// hammer
		'metal' => '<path d="M112 50h64c8 0 14 6 14 14s-6 14-14 14h-18v10c0 5-4 9-9 9h-8l-6 56h-16l6-56h-8c-5 0-9-4-9-9V78h-14c-6 0-10-5-10-11 0-9 7-17 16-17z"/>',
		// key
		'lock'  => '<path d="M162 44a30 30 0 00-28 40l-30 30 10 10 8-8 10 10 10-10 8 8 12-12a30 30 0 100-68zm6 16a10 10 0 110 20 10 10 0 010-20z"/>',
		// broom + sparkle
		'clean' => '<rect x="140" y="40" width="12" height="56" rx="5"/>
			<path d="M116 96h60l10 54h-80z"/>
			<path d="M126 150v-22M146 150v-26M166 150v-22" stroke="#000" stroke-opacity=".35" stroke-width="5" fill="none"/>',
	);

	return isset( $tools[ $slug ] ) ? $tools[ $slug ] : $tools['metal'];
}

/**
 * A maâlem, carved in relief: a lit top edge and a shadowed underside so the
 * figure reads as cut into wood rather than a flat sticker.
 */
function m3allem_figure( $slug, $class = 'figure' ) {
	$uid  = 'm3f-' . $slug;
	$tool = m3allem_tool_path( $slug );

	ob_start();
	?>
<svg class="<?php echo esc_attr( $class ); ?>" viewBox="0 0 220 340" role="img" aria-hidden="true" focusable="false">
	<defs>
		<linearGradient id="<?php echo esc_attr( $uid ); ?>-carve" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#ffe6a8"/>
			<stop offset=".45" stop-color="#e0ab3f"/>
			<stop offset="1" stop-color="#8a5f18"/>
		</linearGradient>
		<linearGradient id="<?php echo esc_attr( $uid ); ?>-tool" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#fff1c9"/>
			<stop offset="1" stop-color="#c08c2a"/>
		</linearGradient>
	</defs>

	<?php // the shadow he casts on the floor of his zone ?>
	<ellipse cx="88" cy="322" rx="56" ry="10" fill="#000" opacity=".45"/>

	<g fill="url(#<?php echo esc_attr( $uid ); ?>-carve)"
		stroke="#3a2607" stroke-opacity=".5" stroke-width="2.5" stroke-linejoin="round">
		<?php // head under a hood ?>
		<circle cx="86" cy="62" r="29"/>
		<path d="M57 60c0-18 13-31 29-31s29 13 29 31c0 4-1 7-2 10-6-8-15-13-27-13s-21 5-27 13c-1-3-2-6-2-10z" opacity=".6"/>

		<?php // djellaba ?>
		<path d="M86 95c-25 0-42 15-46 38l-13 78c-1 8 4 13 11 13h13l6 84c0 6 5 10 10 10h36c6 0 10-4 10-10l6-84h13c7 0 12-5 11-13l-13-78c-4-23-21-38-46-38z"/>

		<?php // the arm held out, clear of the body, so the tool reads ?>
		<path d="M116 116c16-9 35-4 45 12l14 22-22 14-14-22c-5-8-14-10-21-6z"/>
		<?php // the resting arm ?>
		<path d="M54 120c-13 5-21 15-23 30l-6 44 21 4 6-42c1-8 5-13 13-15z" opacity=".95"/>
	</g>

	<?php // chisel lines that catch the light ?>
	<g stroke="#2a1b06" stroke-opacity=".34" stroke-width="3" fill="none" stroke-linecap="round">
		<path d="M86 130v92M65 152l-6 58M107 152l6 58"/>
		<path d="M62 238h48"/>
	</g>

	<?php // the tool in the raised hand ?>
	<g fill="url(#<?php echo esc_attr( $uid ); ?>-tool)" color="#f0cf7a">
		<g transform="translate(14,10) scale(.86)"><?php echo $tool; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></g>
	</g>
</svg>
	<?php
	return ob_get_clean();
}

/** Small tool mark, used as a watermark behind a zone. */
function m3allem_emblem( $slug, $class = 'emblem' ) {
	ob_start();
	?>
<svg class="<?php echo esc_attr( $class ); ?>" viewBox="90 30 110 130" role="img" aria-hidden="true" focusable="false" fill="currentColor" color="currentColor">
	<?php echo m3allem_tool_path( $slug ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</svg>
	<?php
	return ob_get_clean();
}
