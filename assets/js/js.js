
jQuery( document ).ready( function( $ ){

    var getTemplate = _.memoize(function () {

        var compiled,
            /*
             * Underscore's default ERB-style templates are incompatible with PHP
             * when asp_tags is enabled, so WordPress uses Mustache-inspired templating syntax.
             *
             * @see trac ticket #22344.
             */
            options = {
                evaluate: /<#([\s\S]+?)#>/g,
                interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
                escape: /\{\{([^\}]+?)\}\}(?!\})/g,
                variable: 'data'
            };

        return function (data, id, data_variable_name ) {
            if (_.isUndefined(id)) {
                id = 'customify-site-item-html';
            }
            if ( ! _.isUndefined( data_variable_name ) && _.isString( data_variable_name ) ) {
                options.variable = data_variable_name;
            } else {
                options.variable = 'data';
            }
            compiled = _.template($('#' + id).html(), null, options);
            return compiled(data);
        };

    });


    var Customify_Site = {
        data: {},
        filter_data: {},
        skip_render_filter: false,
        xhr: null,
        getTemplate: getTemplate,
        el: $( '#customify-sites-listing-outer' ),
        load_sites: function ( cb ) {
            var that = this;
            if ( that.xhr ) {
                //kill the request
                that.xhr.abort();
                that.xhr = null;
            }
            $( 'body' ).addClass('loading-content');
            that.filter_data = that.get_filter_data();
            that.filter_data['_t'] = new Date().getTime();
            that.xhr = $.ajax( {
                url: Customify_Sites.api_url,
                data: that.filter_data,
                type: 'GET',
                success: function( res ){
                    that.data = res;

                    that.render_items();
                    if ( ! that.skip_render_filter ) {
                        that.filter_bar( );
                        that.render_categories();
                        that.render_tags( );
                    }
                    $( '#customify-sites-filter-count' ).text( res.total );
                    $( 'body' ).removeClass('loading-content');
                    that.view_details();

                    if ( typeof cb === 'function' ) {
                        cb( res );
                    }
                }
            } );
        },

        filter_bar: function(){
            if ( ! this.el.hasClass('cs-hide-filter') ) {
                var html=  $( '#customify-site-filter-html' ).html();
                this.el.prepend( html );
            }
        },

        render_items: function(){
            var that = this;
            var template = that.getTemplate();
            if ( that.data.total <= 0 ) {
                $( 'body' ).addClass('no-results');
            } else {
                $( 'body' ).removeClass('no-results');
            }
            $( '#customify-sites-listing .cs-site, #customify-sites-listing .cs-loading-text' ).remove();

            var index = 0;
            _.each( that.data.posts, function( item ){
                var html = template( item );
                var $item_html = $( html );
                $item_html.attr( 'data-index', index );
                $( '#customify-sites-listing' ).append( $item_html );
                index ++ ;
            } );
        },

        render_categories: function(){
            var that = this;
            _.each( that.data.categories, function( item ){
                var html = '<li><a href="#" data-slug="'+item.slug+'">'+item.name+'</a></li>';
                $( '#customify-sites-filter-cat' ).append( html );
            } );
        },

        render_tags: function(){
            var that = this;
            _.each( that.data.tags, function( item ){
                var html = '<li><a href="#" data-slug="'+item.slug+'">'+item.name+'</a></li>';
                $( '#customify-sites-filter-tag' ).append( html );
            } );
        },

        get_filter_data: function(){
            var number = this.el.data( 'number' ) || '';
            var cat = $( '#customify-sites-filter-cat a.current' ).eq(0).attr( 'data-slug' ) || '';
            var tag = $( '#customify-sites-filter-tag a.current' ).eq(0).attr( 'data-slug' ) || '';
            var s = $( '#customify-sites-search-input' ).val();
            if ( cat === 'all' ) {
                cat = '';
            }
            return {
                cat: cat,
                tag: tag,
                s: s,
                per_page: number
            }
        },

        filter: function(){
            var that = this;
            $( document ).on( 'click', '#customify-sites-filter-cat a', function( e ){
                e.preventDefault();
                if ( ! $( this ).hasClass( 'current' ) ) {
                    $('#customify-sites-filter-cat a').removeClass('current');
                    $('#customify-sites-filter-tag a').removeClass('current');
                    $(this).addClass('current');
                    that.filter_data = {};
                    that.filter_data = that.get_filter_data();
                    that.skip_render_filter = true;
                    that.load_sites();
                }
            } );

            $( document ).on( 'click', '#customify-sites-filter-tag a', function( e ){
                e.preventDefault();
                if ( ! $( this ).hasClass( 'current' ) ) {
                    $('#customify-sites-filter-tag a').removeClass('current');
                    $(this).addClass('current');
                    that.filter_data = that.get_filter_data();
                    that.skip_render_filter = true;
                    that.load_sites();
                }
            } );

            // Search demo
            $( document ).on( 'change keyup', '#customify-sites-search-input', function(){
                $( '#customify-sites-filter-cat a' ).removeClass( 'current' );
                $( '#customify-sites-filter-tag a' ).removeClass( 'current' );
                $( 'body' ).removeClass( 'no-results' );
                that.skip_render_filter = true;
                that.filter_data = that.get_filter_data();
                that.load_sites();

            } );

        },

        view_details: function(){
        },

        init: function(){
            var that = this;
            that.filter_data = {};
            that.load_sites();
            that.filter();

        }
    };


    var Customify_Site_Preview = {
        el: $( '#customify-site-preview' ),
        previewing: '',
        init: function(){
            var that = this;
            // open view
            $( document ).on( 'click', '#customify-sites-listing .theme-screenshot', function( e ) {
                e.preventDefault();
                var slug = $( this ).attr( 'data-slug' ) || '';
                console.log( 'slug', slug );
                if( ! _.isUndefined( Customify_Site.data.posts[ slug ] )  ) {
                    var data = Customify_Site.data.posts[ slug ];
                    that.previewing = data.slug;
                    $( '#customify-site-preview' ).removeClass( 'cs-iframe-loaded' );
                    that.el.find( '.cs-iframe iframe' ).attr( 'src', data.demo_url );
                    $( '.cs-iframe', that.el ).attr( 'data-device', '' );
                    $( '.cs-demo-name', that.el ).text( data.title );
                    that.el.removeClass( 'cs-hide' );
                    $( 'body' ).addClass( 'cs-previewing-site' );
                }
            } );


            // Device view
            $( document ).on( 'click', '.cs-device-view', function( e ) {
                e.preventDefault();
                $( '.cs-device-view' ).removeClass( 'current' );
                $( this ).addClass( 'current' );
                var device = $( this ).attr( 'data-device' ) || 'desktop';
                $( '.cs-iframe', that.el ).attr( 'data-device', device );
            } );


            // Close
            var close = function(){
                that.el.addClass( 'cs-hide' );
                $( '.cs-iframe', that.el ).attr( 'data-device', '' );
                that.el.find( '.cs-iframe iframe' ).attr( 'src', '' );
                $( 'body' ).removeClass( 'cs-previewing-site' );
                $( '#customify-site-preview' ).removeClass( 'cs-iframe-loaded' );
            };

            $( document ).on( 'click', '.cs-preview-close', function( e ) {
                e.preventDefault();
                close();
            } );

            $( window ).on( 'keydown', function( e ) {
                if ( e.keyCode === 27 ){ // esc button
                    close();
                }
            } );

            $( document ).on( 'click', '.cs-preview-nav', function( e ) {
                e.preventDefault();
                var action = $( this ).attr( 'data-action' ) || 'next';

                var current_demo = $( '#customify-sites-listing .cs-site[data-slug="'+that.previewing+'"]' );
                var $item;
                if ( action === 'next' ) {
                    $item = current_demo.next();
                } else {
                    $item = current_demo.prev();
                }
                if ( $item.length > 0 ) {
                    $item.click();
                }
            } );

            // Click import button
            $( document ).on( 'click', '.cs-preview-import', function( e ) {
                e.preventDefault();
                close();
                var current_demo = $( '#customify-sites-listing .theme[data-slug="'+that.previewing+'"]' );
                $('.cs-open-modal', current_demo ).click();
            } );

        }
    };



    Customify_Site.init();
    Customify_Site_Preview.init();

    $( '#cs-preview-iframe' ).load( function(){
        $( '#customify-site-preview' ).addClass( 'cs-iframe-loaded' );
    } );

} );