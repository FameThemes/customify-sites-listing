
<script type="text/html" id="customify-site-filter-html">
    <div id="customify-sites-filter" class="wp-filter hide-if-no-js">
        <div class="filter-count">
            <span id="customify-sites-filter-count" class="count theme-count">&#45;</span>
        </div>
        <ul id="customify-sites-filter-cat" class="filter-links">
            <li><a href="#" data-slug="all" class="current"><?php _e( 'All', 'customify-sites-listing' ); ?></a></li>
        </ul>
        <form class="search-form">
            <label class="screen-reader-text" for="wp-filter-search-input"><?php _e( 'Search Sites', 'customify-sites-listing' ); ?></label><input placeholder="<?php esc_attr_e( 'Search sites...', 'customify-sites-listing' ); ?>" type="search" aria-describedby="live-search-desc" id="customify-sites-search-input" class="wp-filter-search">
        </form>
        <ul id="customify-sites-filter-tag"  class="filter-links float-right" style="float: right;"></ul>
    </div>
</script>

<script id="customify-site-item-html" type="text/html">
    <div class="cs-site customify-col" data-slug="{{ data.slug }}">
        <div class="theme" title="{{ data.title }}" tabindex="0" aria-describedby="">
            <div class="theme-screenshot">
                <img src="{{ data.thumbnail_url }}" alt="">
            </div>
            <div class="theme-id-container">
                <h2 class="theme-name" id="{{ data.slug }}-name">{{ data.title }}</h2>
                <div class="theme-desc" id="{{ data.slug }}-desc">{{{ data.desc }}}</div>
            </div>
        </div>
    </div>
</script>