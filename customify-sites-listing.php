<?php
/*
Plugin Name: Customify Sites Listing
Plugin URI: https://wpcustomify.com
Description: Display customify demo site on frontend
Author: WPCustomify
Author URI: https://wpcustomify.com
Version: 0.0.1
Text Domain: customify-sites-listing
License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*/

define( 'CUSTOMIFY_SITES_LISTING_URL', untrailingslashit( plugins_url(  '', __FILE__ ) ) );
define( 'CUSTOMIFY_SITES_LISTING_PATH',dirname( __FILE__ ) );
require dirname( __FILE__ ) . '/classess/class-sites.php';
Customify_Sites_Listing::get_instance();

function customify_site_listing_shortcode_func( $atts ) {
    $loading_icon = '<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#ddd"> <g fill="none" fill-rule="evenodd"> <g transform="translate(1 1)" stroke-width="2"> <circle stroke-opacity=".5" cx="18" cy="18" r="18"/> <path d="M36 18c0-9.94-8.06-18-18-18"> <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/> </path> </g> </g></svg>';
    return
            '<div id="customify-sites-listing-outer">'
                .'<div id="customify-sites-listing-wrapper" class="theme-browser rendered">'
                .'<div id="customify-sites-listing" class="customify-grid-3_md-2_sm_1 themes wp-clearfix"></div>'
                .'</div>'
                .'<p id="customify-sites-no-demos"  class="no-themes">'.__( 'No sites found. Try a different search.', 'customify-sites-listing' ).'</p>'
                .'<div class="cs-loading-text"><span class="cs-loading-icon">'.$loading_icon.'</span>'.__( 'Loading sites, please wait...', 'customify-sites-listing' ).'</div>'
            .'</div>';
}
add_shortcode( 'customify-sites-listing', 'customify_site_listing_shortcode_func' );
