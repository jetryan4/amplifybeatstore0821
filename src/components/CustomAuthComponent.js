import {Authenticator, useAuthenticator, useTheme, CheckboxField, Link, View, Image, Text} from '@aws-amplify/ui-react';
import React from "react";

import logo from "../assets/logo_new_black.png";

export const customAuthComponent = {

    className: "authenticator-view",
    variation: "modal",
    components: {
        Header() {
            const { tokens } = useTheme();

            return (
                <View textAlign="center" padding={tokens.space.large}>
                    <Image
                        width="25%"
                        height="25%"
                        alt="Rankine Records Logo"
                        src={logo}
                    />
                </View>
            );
        },
        Footer() {
            const { tokens } = useTheme();

            return (
                <View textAlign="center" padding={tokens.space.large}>
                    <Text color={`${tokens.colors.neutral['80']}`}>
                       &copy; 2022 Rankine Records. All Rights Reserved.
                    </Text>
                </View>
            );
        },
        SignUp: {
            FormFields() {
                const { validationErrors } = useAuthenticator();

                return (
                    <>
                        <Authenticator.SignUp.FormFields />

                        <Link  href="http://localhost:3000/policies" isExternal={true}>
                            <CheckboxField
                                errorMessage={validationErrors.acknowledgement}
                                hasError={!!validationErrors.acknowledgement}
                                name="acknowledgement"
                                value="yes"
                                label="I agree with the Terms & Conditions"
                            />
                        </Link>

                    </>
                );
            },
        }
    },
    services: {
        async validateCustomSignUp(formData) {
            if (!formData.acknowledgement) {
                return {
                    acknowledgement: 'Please read and agree to the Terms & Conditions',
                };
            }
        },
    }
}
