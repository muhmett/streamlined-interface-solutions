<?php
/**
 * One artisan: contact, portfolio, reviews.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();

	$id       = get_the_ID();
	$card     = m3allem_card( get_post() );
	$verified = $card['v'];
	$wa       = $card['wa'] ? $card['wa'] : ( $card['t'] ? '212' . ltrim( $card['t'], '0' ) : '' );
	$stars    = str_repeat( '★', (int) round( $card['r'] ) ) . str_repeat( '☆', 5 - (int) round( $card['r'] ) );
	?>

	<section class="app on">
		<div class="head">
			<div>
				<h2><?php the_title(); ?> <?php echo $verified ? '<span class="vf" title="موثّق">✓</span>' : ''; ?></h2>
				<p><?php echo esc_html( $card['cn'] ); ?><?php echo $card['city'] ? ' · ' . esc_html( $card['city'] ) : ''; ?></p>
			</div>
			<a class="btn ghost" href="<?php echo esc_url( home_url( '/client/' ) ); ?>">← رجع للبحث</a>
		</div>

		<div class="grid g3" style="grid-template-columns:1.3fr 1fr;margin-bottom:20px">
			<div class="card">
				<div class="stars" style="font-size:18px"><?php echo esc_html( $stars ); ?>
					<small><?php echo esc_html( $card['r'] ? $card['r'] : '—' ); ?> (<?php echo (int) $card['k']; ?> تقييم)</small>
				</div>
				<?php if ( get_the_content() ) : ?>
					<div style="margin-top:16px;line-height:1.9;opacity:.85"><?php the_content(); ?></div>
				<?php endif; ?>
				<div class="acts">
					<?php if ( $card['t'] ) : ?>
						<a class="a-call" href="tel:<?php echo esc_attr( $card['t'] ); ?>">📞 عيّط</a>
					<?php endif; ?>
					<?php if ( $wa ) : ?>
						<a class="a-wa" href="https://wa.me/<?php echo esc_attr( $wa ); ?>" target="_blank" rel="noopener">واتساب</a>
					<?php endif; ?>
				</div>
			</div>

			<div class="card">
				<h3 style="font-size:18px;font-weight:900">المعلومات</h3>
				<div class="row"><div><div class="t">الحرفة</div></div><span><?php echo esc_html( $card['cn'] ); ?></span></div>
				<?php if ( $card['city'] ) : ?>
					<div class="row"><div><div class="t">المدينة</div></div><span><?php echo esc_html( $card['city'] ); ?></span></div>
				<?php endif; ?>
				<div class="row"><div><div class="t">موثّق</div></div>
					<span class="badge <?php echo $verified ? 'b-ok' : 'b-wait'; ?>"><?php echo $verified ? 'إيه ✓' : 'مازال'; ?></span>
				</div>
			</div>
		</div>

		<?php
		$gallery = get_attached_media( 'image', $id );
		if ( $gallery ) :
			?>
			<div class="card" style="margin-bottom:20px">
				<h3 style="font-size:19px;font-weight:900">الخدمة ديالو</h3>
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
			</div>
		<?php endif; ?>

		<div class="card">
			<h3 style="font-size:19px;font-weight:900">التقييمات</h3>
			<?php
			$comments = get_comments(
				array(
					'post_id' => $id,
					'status'  => 'approve',
				)
			);
			if ( $comments ) {
				foreach ( $comments as $c ) {
					$r = (int) get_comment_meta( $c->comment_ID, 'm3_rating', true );
					printf(
						'<div class="row"><div><div class="t">%s <span style="color:var(--gold)">%s</span></div><div class="s">%s</div></div><span class="s">%s</span></div>',
						esc_html( $c->comment_author ),
						esc_html( str_repeat( '★', $r ) . str_repeat( '☆', 5 - $r ) ),
						esc_html( $c->comment_content ),
						esc_html( get_comment_date( '', $c ) )
					);
				}
			} else {
				echo '<p style="opacity:.6;font-size:14px;margin-top:10px">مازال ماكاين حتى تقييم. كون نتا الأول.</p>';
			}

			comment_form();
			?>
		</div>
	</section>

	<?php
endwhile;

get_footer();
