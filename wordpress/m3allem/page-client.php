<?php
/**
 * Client dashboard — served on the page with the slug "client".
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

get_header();

$preset  = isset( $_GET['hirfa'] ) ? sanitize_key( wp_unslash( $_GET['hirfa'] ) ) : '';
$cities  = get_theme_mod( 'm3_cities', 'الدار البيضاء,الرباط,مراكش,فاس,طنجة,أكادير,مكناس,وجدة' );
$cities  = array_filter( array_map( 'trim', explode( ',', $cities ) ) );
?>

<section class="app on" id="client" data-preset="<?php echo esc_attr( $preset ); ?>">
	<div class="head">
		<div><h2>الواجهة ديال الكليان</h2><p>قلّب، عيّط، وتبّع الخدمات ديالك</p></div>
		<a class="btn ghost" href="<?php echo esc_url( home_url( '/' ) ); ?>">← رجع للجولة</a>
	</div>

	<div class="search">
		<input id="q" type="search" placeholder="قلّب على معلّم ولا حرفة…" aria-label="قلّب">
		<select id="city" aria-label="المدينة">
			<option value="">كل المدن</option>
			<?php foreach ( $cities as $city ) : ?>
				<option><?php echo esc_html( $city ); ?></option>
			<?php endforeach; ?>
		</select>
	</div>

	<div class="filters" id="filters"></div>

	<div class="grid g3" id="results" style="margin-bottom:26px">
		<div class="card" style="grid-column:1/-1;text-align:center;padding:44px;opacity:.7">كنقلّب…</div>
	</div>

	<div class="grid g3">
		<div class="card urg">
			<span class="tag">⚡ مشكل عاجل</span>
			<h3 style="font-size:19px;font-weight:900">عندك شي حاجة خاصها دابا؟</h3>
			<p style="opacity:.72;font-size:14px;margin-top:8px;line-height:1.8">
				نشر المشكل وغادي يوصل نيشان للمعلّمية لي قريبين ليك، وهوما لي غادي يتواصلو معاك.
			</p>
			<textarea id="urgTxt" placeholder="مثلا: كاين تسربة ديال الما فالكوزينة، عاجل…" style="margin-top:14px"></textarea>
			<input id="urgTel" type="tel" placeholder="التيليفون ديالك" style="width:100%;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--paper);font:inherit;font-size:15px;margin-top:10px">
			<button class="btn gold" id="urgBtn" style="width:100%;justify-content:center;margin-top:12px">نشر المشكل دابا</button>
		</div>

		<div class="card">
			<h3 style="font-size:19px;font-weight:900">المشاكل لي نشرتي</h3>
			<div id="cJobs" style="margin-top:10px">
			<?php
			if ( is_user_logged_in() ) {
				$mine = get_posts(
					array(
						'post_type'      => 'talab',
						'author'         => get_current_user_id(),
						'posts_per_page' => 8,
					)
				);
				if ( $mine ) {
					foreach ( $mine as $t ) {
						printf(
							'<div class="row"><div><div class="t">%s</div><div class="s">%s</div></div><span class="badge b-wait">منشور</span></div>',
							esc_html( get_the_title( $t ) ),
							esc_html( get_the_date( '', $t ) )
						);
					}
				} else {
					echo '<p style="opacity:.6;font-size:14px">مازال مانشرتي حتى مشكل.</p>';
				}
			} else {
				printf(
					'<p style="opacity:.7;font-size:14px">دخل لحسابك باش تتبّع المشاكل ديالك. <a style="color:var(--gold)" href="%s">دخول</a></p>',
					esc_url( wp_login_url( get_permalink() ) )
				);
			}
			?>
			</div>
		</div>

		<div class="card">
			<h3 style="font-size:19px;font-weight:900">آخر التقييمات فالمنصة</h3>
			<div style="margin-top:10px">
			<?php
			$recent = get_comments(
				array(
					'number'     => 5,
					'status'     => 'approve',
					'post_type'  => 'm3allem',
				)
			);
			if ( $recent ) {
				foreach ( $recent as $c ) {
					$rating = (int) get_comment_meta( $c->comment_ID, 'm3_rating', true );
					printf(
						'<div class="row"><div><div class="t">%s %s</div><div class="s">«%s»</div></div></div>',
						esc_html( get_the_title( $c->comment_post_ID ) ),
						esc_html( str_repeat( '★', $rating ) . str_repeat( '☆', 5 - $rating ) ),
						esc_html( wp_trim_words( $c->comment_content, 14, '…' ) )
					);
				}
			} else {
				echo '<p style="opacity:.6;font-size:14px">مازال ماكاين حتى تقييم.</p>';
			}
			?>
			</div>
		</div>
	</div>
</section>

<?php get_footer(); ?>
