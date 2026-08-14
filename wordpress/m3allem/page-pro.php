<?php
/**
 * Artisan dashboard — served on the page with the slug "pro".
 * Logged out it shows the sign-up form instead.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

get_header();

$zones   = m3allem_zones_payload();
$profile = m3allem_my_profile();
$notice  = isset( $_GET['m3'] ) ? sanitize_key( wp_unslash( $_GET['m3'] ) ) : '';
?>

<section class="app on" id="pro">

<?php if ( ! $profile ) : ?>

	<div class="head">
		<div><h2>سجّل كمعلّم</h2><p>عمّر المعلومات ديالك وغادي تبان فالزون ديال الصنعة ديالك</p></div>
		<a class="btn ghost" href="<?php echo esc_url( home_url( '/' ) ); ?>">← رجع للجولة</a>
	</div>

	<?php if ( 'dup' === $notice ) : ?>
		<div class="card urg" style="margin-bottom:16px">هاد الإيميل مسجّل من قبل. <a style="color:var(--gold)" href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>">دخل لحسابك</a></div>
	<?php elseif ( 'bad' === $notice ) : ?>
		<div class="card urg" style="margin-bottom:16px">شي معلومة ناقصة ولا غالطة. عاود عمّرها عافاك (الكود ديال السر خاصو 6 حروف على الأقل).</div>
	<?php endif; ?>

	<div class="card" style="max-width:620px">
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<?php wp_nonce_field( 'm3_signup' ); ?>
			<input type="hidden" name="action" value="m3_signup">

			<p class="m3-field"><label for="s-name">السمية ديالك</label>
				<input id="s-name" name="name" type="text" required placeholder="مثلا: محمد العلوي"></p>

			<p class="m3-field"><label for="s-craft">الحرفة ديالك</label>
				<select id="s-craft" name="craft" required>
					<option value="">اختار الحرفة</option>
					<?php foreach ( $zones as $z ) : ?>
						<option value="<?php echo esc_attr( $z['id'] ); ?>"><?php echo esc_html( $z['n'] ); ?></option>
					<?php endforeach; ?>
				</select></p>

			<p class="m3-field"><label for="s-city">المدينة</label>
				<input id="s-city" name="city" type="text" placeholder="الدار البيضاء"></p>

			<p class="m3-field"><label for="s-tel">التيليفون</label>
				<input id="s-tel" name="tel" type="tel" required placeholder="0661234567"></p>

			<p class="m3-field"><label for="s-email">الإيميل</label>
				<input id="s-email" name="email" type="email" required></p>

			<p class="m3-field"><label for="s-pass">الكود ديال السر</label>
				<input id="s-pass" name="pass" type="password" required minlength="6"></p>

			<button class="btn gold" type="submit" style="width:100%;justify-content:center">سجّل وبان للناس</button>
			<p style="opacity:.6;font-size:13px;margin-top:12px">الحساب ديالك غادي يتشيّك من طرف الإدارة قبل ما يبان للعموم.</p>
		</form>
	</div>

<?php else : ?>

	<?php
	$craft   = get_the_terms( $profile, 'hirfa' );
	$craft   = ( $craft && ! is_wp_error( $craft ) ) ? $craft[0] : null;
	$rating  = (float) get_post_meta( $profile->ID, '_m3_rating', true );
	$reviews = (int) get_post_meta( $profile->ID, '_m3_reviews', true );
	$jobs    = (int) get_post_meta( $profile->ID, '_m3_jobs', true );
	$verified= (bool) get_post_meta( $profile->ID, '_m3_verified', true );

	$urgent = get_posts(
		array(
			'post_type'      => 'talab',
			'posts_per_page' => 8,
		)
	);
	?>

	<div class="head">
		<div>
			<h2>الداشبورد ديال المعلّم</h2>
			<p>
				<?php echo esc_html( get_the_title( $profile ) ); ?>
				<?php echo $craft ? ' — ' . esc_html( $craft->name ) : ''; ?>
				<?php
				$city = get_post_meta( $profile->ID, '_m3_city', true );
				echo $city ? ' · ' . esc_html( $city ) : '';
				?>
				<?php if ( $verified ) : ?>
					· <span style="color:var(--gold)">موثّق ✓</span>
				<?php elseif ( 'pending' === $profile->post_status ) : ?>
					· <span style="color:var(--gold)">فانتظار التشييك</span>
				<?php endif; ?>
			</p>
		</div>
		<a class="btn ghost" href="<?php echo esc_url( home_url( '/' ) ); ?>">← رجع للجولة</a>
	</div>

	<?php if ( 'saved' === $notice ) : ?>
		<div class="card" style="margin-bottom:16px;border-color:rgba(110,231,168,.4)">تسجّلات التبديلات ✓</div>
	<?php endif; ?>

	<div class="grid g4" style="margin-bottom:18px">
		<div class="card kpi"><b><?php echo (int) $jobs; ?></b><span>خدمة مكمّلة</span></div>
		<div class="card kpi"><b><?php echo esc_html( $rating ? $rating : '—' ); ?></b><span>معدل النقطة</span></div>
		<div class="card kpi"><b><?php echo (int) $reviews; ?></b><span>تقييم</span></div>
		<div class="card kpi"><b><?php echo (int) count( $urgent ); ?></b><span>فرص عاجلة</span></div>
	</div>

	<div class="grid g3" style="grid-template-columns:1.2fr 1fr;margin-bottom:18px">
		<div class="card">
			<h3 style="font-size:19px;font-weight:900">المشاكل العاجلة</h3>
			<div style="margin-top:8px">
			<?php if ( $urgent ) : ?>
				<?php foreach ( $urgent as $t ) : ?>
					<?php
					$tel  = get_post_meta( $t->ID, '_m3_phone', true );
					$city = get_post_meta( $t->ID, '_m3_city', true );
					?>
					<div class="row">
						<div>
							<div class="t"><?php echo esc_html( get_the_title( $t ) ); ?></div>
							<div class="s"><?php echo esc_html( $city ? $city . ' · ' : '' ); ?><?php echo esc_html( human_time_diff( get_post_time( 'U', false, $t ) ) ); ?> هادي</div>
						</div>
						<?php if ( $tel ) : ?>
							<a class="badge b-new" href="tel:<?php echo esc_attr( $tel ); ?>">📞 عيّط</a>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			<?php else : ?>
				<p style="opacity:.6;font-size:14px">ماكاين حتى مشكل عاجل دابا.</p>
			<?php endif; ?>
			</div>
		</div>

		<div class="card">
			<h3 style="font-size:19px;font-weight:900">آخر التقييمات ديالك</h3>
			<div style="margin-top:8px">
			<?php
			$mine = get_comments(
				array(
					'post_id' => $profile->ID,
					'status'  => 'approve',
					'number'  => 6,
				)
			);
			if ( $mine ) {
				foreach ( $mine as $c ) {
					$r = (int) get_comment_meta( $c->comment_ID, 'm3_rating', true );
					printf(
						'<div class="row"><div><div class="t">%s</div><div class="s">«%s»</div></div></div>',
						esc_html( str_repeat( '★', $r ) . str_repeat( '☆', 5 - $r ) ),
						esc_html( wp_trim_words( $c->comment_content, 14, '…' ) )
					);
				}
			} else {
				echo '<p style="opacity:.6;font-size:14px">مازال ماعندك تقييمات.</p>';
			}
			?>
			</div>
		</div>
	</div>

	<div class="card" style="margin-bottom:18px">
		<h3 style="font-size:19px;font-weight:900">المعلومات ديالي</h3>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top:14px;max-width:620px">
			<?php wp_nonce_field( 'm3_profile' ); ?>
			<input type="hidden" name="action" value="m3_save_profile">

			<p class="m3-field"><label for="p-craft">الحرفة</label>
				<select id="p-craft" name="craft">
					<?php foreach ( $zones as $z ) : ?>
						<option value="<?php echo esc_attr( $z['id'] ); ?>" <?php selected( $craft && $craft->slug === $z['id'] ); ?>>
							<?php echo esc_html( $z['n'] ); ?>
						</option>
					<?php endforeach; ?>
				</select></p>

			<p class="m3-field"><label for="p-tel">التيليفون</label>
				<input id="p-tel" name="_m3_phone" type="tel" value="<?php echo esc_attr( get_post_meta( $profile->ID, '_m3_phone', true ) ); ?>"></p>

			<p class="m3-field"><label for="p-wa">واتساب</label>
				<input id="p-wa" name="_m3_whatsapp" type="tel" value="<?php echo esc_attr( get_post_meta( $profile->ID, '_m3_whatsapp', true ) ); ?>"></p>

			<p class="m3-field"><label for="p-city">المدينة</label>
				<input id="p-city" name="_m3_city" type="text" value="<?php echo esc_attr( get_post_meta( $profile->ID, '_m3_city', true ) ); ?>"></p>

			<p class="m3-field"><label for="p-bio">شنو كتخدم بالضبط</label>
				<textarea id="p-bio" name="bio" rows="4"><?php echo esc_textarea( $profile->post_content ); ?></textarea></p>

			<button class="btn gold" type="submit">سجّل التبديلات</button>
		</form>
	</div>

	<div class="card">
		<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
			<h3 style="font-size:19px;font-weight:900">الخدمة ديالي — بحال انسطا</h3>
			<a class="btn gold" href="<?php echo esc_url( admin_url( 'post.php?post=' . $profile->ID . '&action=edit' ) ); ?>">＋ زيد صورة</a>
		</div>
		<?php
		$gallery = get_attached_media( 'image', $profile->ID );
		if ( $gallery ) :
			?>
			<div class="folio">
				<?php foreach ( $gallery as $img ) : ?>
					<figure>
						<img src="<?php echo esc_url( wp_get_attachment_image_url( $img->ID, 'medium_large' ) ); ?>" alt="" loading="lazy">
						<?php if ( $img->post_title ) : ?>
							<figcaption><?php echo esc_html( $img->post_title ); ?></figcaption>
						<?php endif; ?>
					</figure>
				<?php endforeach; ?>
			</div>
		<?php else : ?>
			<p style="opacity:.6;font-size:14px;margin-top:12px">مازال ماعندك تصاور. تالعهم من «زيد صورة» وغادي يبانو هنا وفالبروفايل ديالك.</p>
		<?php endif; ?>
	</div>

<?php endif; ?>

</section>

<?php get_footer(); ?>
