<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Auth extends Vue {
  msg!: string;
  count: number = 0;

  test() {
    this.count++;
  }
}
</script>

<template>
  <div class="auth-page flex items-center justify-center h-screen w-screen">
    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div class="card-body">
        <div class="mb-3">
          <img src="../assets/logo.svg" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input type="text" placeholder="Email" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Пароль</span>
          </label>
          <input
            type="password"
            placeholder="Пароль"
            class="input input-bordered"
          />
          <label class="label">
            <a href="#" class="label-text-alt">Forgot password?</a>
          </label>
        </div>
        <div class="form-control mt-6">
          <input
            type="button"
            value="Зарегистрироваться"
            class="btn btn-primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
}
</style>
