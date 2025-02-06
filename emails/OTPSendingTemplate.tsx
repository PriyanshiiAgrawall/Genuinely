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
} from '@react-email/components';
import * as React from 'react';

export interface OtpEmailSendingProps {
    otp: string;
    email: string;
}

export default function OtpSendingEmailTemplate({ otp, email }: OtpEmailSendingProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify Your Email - Genuinely: A Genuine Testimonials App</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={coverSection}>
                        <Section style={imageSection}>
                            <Img src="#" width="75" height="45" alt="Genuine Feedback Logo" />
                        </Section>
                        <Section style={upperSection}>
                            <Heading style={h1}>Hello, {email}!</Heading>
                            <Text style={mainText}>
                                Thank you for signing up for <strong>Genuinely</strong>. To complete your registration,
                                please enter the following verification code:
                            </Text>
                            <Section style={verificationSection}>
                                <Text style={verifyText}>Your OTP Code</Text>
                                <Text style={codeText}>{otp}</Text>
                                <Text style={validityText}>(This code is valid for 10 minutes)</Text>
                            </Section>
                        </Section>
                        <Hr />
                        <Section style={lowerSection}>
                            <Text style={cautionText}>
                                For security reasons, never share your OTP with anyone. If you didn’t request this, please ignore this email.
                            </Text>
                        </Section>
                    </Section>
                    <Text style={footerText}>
                        This email was sent by <strong>Genuine Feedback</strong>. For any issues, contact us at
                        <Link href="mailto:support@genuinely.com" target="_blank" style={link}>support@genuinely.com</Link>.
                    </Text>
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

const link = {
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

const footerText = { ...text, fontSize: '12px', padding: '0 20px' };
const verifyText = { ...text, margin: 0, fontWeight: 'bold', textAlign: 'center' as const };
const codeText = { ...text, fontWeight: 'bold', fontSize: '36px', margin: '10px 0', textAlign: 'center' as const };
const validityText = { ...text, margin: '0px', textAlign: 'center' as const };
const verificationSection = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const mainText = { ...text, marginBottom: '14px' };
const cautionText = { ...text, margin: '0px' };

