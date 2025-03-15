

import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Button,
} from '@react-email/components';
import * as React from 'react';

export interface ResetPasswordLinkEmailSendingProps {
    name: string;
    link: string;
}

export default function ResetPasswordLinkTemplate({ name, link }: ResetPasswordLinkEmailSendingProps) {
    return (
        <Html>
            <Head />
            <Preview>Reset Your Password - Genuinely: A Genuine Testimonials App</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={coverSection}>
                        <Section style={imageSection}>
                            <Img
                                src="https://genuinely-testimonials.vercel.app/genuinely-logo.png"
                                width="150"
                                height="120"
                                alt="Genuinely Testimonials Logo"
                                style={{ display: "block", margin: "0 auto" }}
                            />
                        </Section>
                        <Section style={upperSection}>
                            <Heading style={h1}>Hello, {name}!</Heading>
                            <Text style={mainText}>
                                We received a request to reset your password for <strong>Genuinely</strong>. Click the button below to proceed.
                            </Text>
                            <Section style={buttonSection}>
                                <Button style={button} href={link}>
                                    Reset Password
                                </Button>
                            </Section>
                            <Text style={validityText}>
                                This link is valid for <strong>30 minutes</strong>. If you didn’t request this, please ignore this email.
                            </Text>
                        </Section>
                        <Hr />
                        <Section style={lowerSection}>
                            <Text style={cautionText}>
                                If you have any issues, contact our support team at
                                <Link href="mailto:support@genuinely.com" target="_blank"> support@genuinely.com</Link>.
                            </Text>
                        </Section>

                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#fff',
    color: '#212121',
};

const container = {
    padding: '20px',
    margin: '0 auto',
    backgroundColor: '#eee',
};

const h1 = {
    color: '#333',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
};

const link: React.CSSProperties = {
    color: '#2754C5',
    fontSize: '14px',
    textDecoration: 'underline',
};

const text = {
    color: '#333',
    fontSize: '14px',
    margin: '24px 0',
};

const imageSection = {
    backgroundColor: '#252f3d',
    display: 'flex',
    padding: '20px 0',
    alignItems: 'center',
    justifyContent: 'center',
};

const coverSection = { backgroundColor: '#fff' };
const upperSection = { padding: '25px 35px' };
const lowerSection = { padding: '25px 35px' };

const validityText = { ...text, margin: '0px', textAlign: 'center' as const };
const mainText = { ...text, marginBottom: '14px' };
const cautionText = { ...text, margin: '0px', textAlign: 'center' as const };

const buttonSection = {
    textAlign: 'center' as const,
    margin: '20px 0',
};

const button = {
    backgroundColor: '#2754C5',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
};


