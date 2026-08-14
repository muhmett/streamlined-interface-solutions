<?php
/**
 * Fallback template — archives, search, blog, and the craft term pages.
 *
 * @package M3allem
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<section class="app on">
	<div class="head">
		<div>
			<h2>
			<?php
			if ( is_tax( 'hirfa' ) ) {
				single_term_title();
			} elseif ( is_search() ) {
				printf( 'نتائج البحث على «%s»', esc_html( get_search_query() ) );
			} elseif ( is_post_type_archive( 'm3allem' ) ) {
				echo 'كل المعلّمية';
			} else {
				the_archive_title();
			}
			?>
			</h2>
			<?php if ( is_tax( 'hirfa' ) && term_description() ) : ?>
				<p><?php echo wp_kses_post( term_description() ); ?></p>
			<?php endif; ?>
		</div>
		<a class="btn ghost" href="<?php echo esc_url( home_url( '/' ) ); ?>">← رجع للجولة</a>
	</div>

	<?php if ( have_posts() ) : ?>
		<div class="grid g3">
			<?php
			while ( have_posts() ) :
				the_post();

				if ( 'm3allem' === get_post_type() ) {
					$card = m3allem_card( get_post() );
					$wa   = $card['wa'] ? $card['wa'] : ( $card['t'] ? '212' . ltrim( $card['t'], '0' ) : '' );
					$n    = (int) round( $card['r'] );
					?>
					<article class="card">
						<div class="pro">
							<div class="av" style="<?php echo $card['img'] ? 'background-image:url(\'' . esc_url( $card['img'] ) . '\')' : ''; ?>"></div>
							<div style="flex:1;min-width:0">
								<div class="nm">
									<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
									<?php echo $card['v'] ? '<span class="vf" title="موثّق">✓</span>' : ''; ?>
								</div>
								<div class="cr"><?php echo esc_html( $card['cn'] ); ?><?php echo $card['city'] ? ' · ' . esc_html( $card['city'] ) : ''; ?></div>
								<div class="stars">
									<?php echo esc_html( str_repeat( '★', $n ) . str_repeat( '☆', 5 - $n ) ); ?>
									<small><?php echo esc_html( $card['r'] ? $card['r'] : '—' ); ?> (<?php echo (int) $card['k']; ?> تقييم)</small>
								</div>
							</div>
						</div>
						<div class="acts">
							<?php if ( $card['t'] ) : ?>
								<a class="a-call" href="tel:<?php echo esc_attr( $card['t'] ); ?>">📞 عيّط</a>
							<?php endif; ?>
							<?php if ( $wa ) : ?>
								<a class="a-wa" href="https://wa.me/<?php echo esc_attr( $wa ); ?>" target="_blank" rel="noopener">واتساب</a>
							<?php endif; ?>
							<a class="a-gh" href="<?php the_permalink(); ?>">البروفايل</a>
						</div>
					</article>
					<?php
				} else {
					?>
					<article class="card">
						<div class="nm"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></div>
						<div class="s" style="margin-top:8px"><?php echo esc_html( get_the_excerpt() ); ?></div>
					</article>
					<?php
				}
			endwhile;
			?>
		</div>

		<div style="margin-top:26px">
			<?php the_posts_pagination( array( 'mid_size' => 1 ) ); ?>
		</div>

	<?php else : ?>
		<div class="card" style="text-align:center;padding:44px">
			<div style="font-size:34px">🔍</div>
			<p style="margin-top:12px;opacity:.72">ماكاين والو هنا. جرّب تقلّب من <a style="color:var(--gold)" href="<?php echo esc_url( home_url( '/client/' ) ); ?>">الواجهة ديال الكليان</a>.</p>
		</div>
	<?php endif; ?>
</section>

<?php get_footer(); ?>
