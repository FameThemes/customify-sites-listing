<?php

Class Customify_Sites_Listing {
    static $_instance = null;
    const THEME_NAME = 'customify';

    function scripts( ){
        wp_enqueue_style('dashicons' );
        wp_localize_script('jquery', 'Customify_Sites',  $this->get_localize_script() );
        wp_enqueue_style('customify-sites-listing', CUSTOMIFY_SITES_LISTING_URL.'/assets/css/style.css' );
        wp_enqueue_script('customify-sites-listing', CUSTOMIFY_SITES_LISTING_URL.'/assets/js/js.js',  array( 'jquery', 'underscore' ), false, true );
    }

    static function get_instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
            add_action( 'wp', array( self::$_instance, 'check_shortcode' ) );
        }
        return self::$_instance;
    }

    function check_shortcode(){
        global $post;
        if ( has_shortcode( $post->post_content, 'customify-sites-listing' ) ) {
            add_action( 'wp_footer', array( self::$_instance, 'templates' ) );
            add_action( 'wp_enqueue_scripts', array( self::$_instance, 'scripts' ) );
        }
    }

    static function get_api_url(){
        return apply_filters( 'customify_sites/api_url', 'https://customifysites.com/wp-json/wp/v2/sites/' );
    }

    function get_localize_script(){
        $args = array(
            'api_url' => self::get_api_url(),
            'ajax_url' => admin_url( 'admin-ajax.php' ),
        );
        return $args;
    }

    function templates(){
        require_once CUSTOMIFY_SITES_LISTING_PATH.'/templates/listing.php';
        require_once CUSTOMIFY_SITES_LISTING_PATH.'/templates/preview.php';
    }


}
