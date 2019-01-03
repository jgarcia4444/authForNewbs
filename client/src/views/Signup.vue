<template>
    <section>
        <h1>Signup</h1>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>
        <form @submit.prevent="signup">
            <div class="form-group">
                <label for="username">
                    Username
                </label>
                <input v-model="user.username" type="text" class="form-control" id="username" aria-describedBy="usernameHelp" placeholder="Enter a username" required />
                <h5 id="usernameHelp" class="form-text text-muted">
                    Username must be longer than two characters and shorter than thirty characters.  Username can only contain alpha numeric characters and underscores.
                </h5>
            </div>
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="password">
                        Password
                    </label>
                    <input v-model="user.password" type="password" class="form-control" id="password" placeholder="Password" aria-describedBy="passwordHelp" required />
                    <h5 id="passwordHelp" class="form-text text-muted">
                        Password must be longer than 10 characters
                    </h5>
                </div> 
                <div class="form-group col-md-6">
                    <label for="confirmPassword">
                        Confirm Password
                    </label>
                    <input v-model="user.confirmPassword" type="password" class="form-control" id="confirmPassword" placeholder="Confirm Password" aria-describedBy="confirmPasswordHelp" required />
                    <h5 id="confirmPasswordHelp" class="form-text text-muted">
                        Please confirm your password.
                    </h5>
                </div>
            </div>
             
            <button type="submit" class="btn btn-primary">
                Signup
            </button>
        </form>
    </section>

</template>

<script>
import Joi from 'joi';

const SIGNUP_URL = 'http://localhost:3000/auth/signup';

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().trim().min(10).required(),
    confirmPassword: Joi.string().trim().min(10).required(),
})

export default {
    data: () => ({
        errorMessage: '',
        user: {
            username: '',
            password: '',
            confirmPassword: '',
        },  
    }),

    watch: {
        user: {
            handler() {
                this.errorMessage = '';
            },
            deep: true,
        }
    },

    methods: {
        signup() {
            this.errorMessage = '';
            if (validUser()) {
                // send data to server...
                console.log('User is valid let\'s send it to the server');
            }
        },
        validUser() {
            if (this.user.password != this.user.confirmPassword) {
                this.errorMessage = 'Passwords must match.';
                return false;
            }

            const result = Joi.validate(this.user, schema);
            if (result.error === null) {
                return true;
            } 
            if (result.error.message.includes('username')) {
                this.errorMessage = 'Username is invalid.';
            } else {
                this.errorMessage = 'Password is invalid';
            }
            return false;
        },
    },
};
</script>

<style>

</style>
