<?php
/**
 * API endpoint class for sending support messages.
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class SupportMessage extends Endpoint {
    /**
     * API endpoint for sending support messages.
     *
     * @since 1.0.0
     *
     * @var string
     */
    protected $endpoint = 'support-message';

    /**
     * Register the routes for handling support message functionality.
     *
     * @return void
     * @since 1.0.0
     */
    public function register_routes() {
        register_rest_route(
            $this->get_namespace(),
            $this->get_endpoint(),
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'send_support_message' ),
                'permission_callback' => array( $this, 'edit_permission' ),
            )
        );
    }

    /**
     * Handle sending the support message.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error
     * @since 1.0.0
     */
    public function send_support_message( WP_REST_Request $request ) {
        $email = sanitize_email( $request['email'] );
        $message = sanitize_textarea_field( $request['message'] );

        if ( empty( $email ) || empty( $message ) ) {
            return new WP_Error( 'rest_support_message_incomplete', __( 'Email and message are required.', 'affiliate-products-importer-for-woocommerce' ), array( 'status' => 400 ) );
        }

        $to = 'info@themedyno.com';
        $subject = __( 'Support Message from User', 'affiliate-products-importer-for-woocommerce' );
        $body = sprintf( "Email: %s\n\nMessage:\n%s", $email, $message );
        $headers = array('Content-Type: text/plain; charset=UTF-8');

        if ( wp_mail( $to, $subject, $body, $headers ) ) {
            return new WP_REST_Response( array( 'status' => 'success', 'message' => __( 'Your message has been sent successfully!', 'affiliate-products-importer-for-woocommerce' ) ), 200 );
        } else {
            return new WP_Error( 'rest_support_message_failed', __( 'Failed to send the message. Please try again later.', 'affiliate-products-importer-for-woocommerce' ), array( 'status' => 500 ) );
        }
    }
} 