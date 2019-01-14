<template>
    <section>
        <h1>Signup</h1>
        <div v-if="signingUp" class="text-center">
            <img src="../assets/Pacman.svg" />
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>
        <form v-if="!signingUp" @submit.prevent="signup">
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
import { setTimeout } from 'timers';

const SIGNUP_URL = 'http://localhost:3000/auth/signup';

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30)
    .required(),
  password: Joi.string().trim().min(10).required(),
  confirmPassword: Joi.string().trim().min(10).required(),
});

export default {
  data: () => ({
    signingUp: false,
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
    },
  },

  methods: {

    signup() {
      this.errorMessage = '';

      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        this.signingUp = true;
        // send data to server...
        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          localStorage.token = result.token;
          setTimeout(() => {
            this.signingUp = false;
            this.$router.push('/dashboard');
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            this.signingUp = false;
            this.errorMessage = error.message;
          }, 1000);
        });
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
