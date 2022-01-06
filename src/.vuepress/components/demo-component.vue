<template>
  <!--  Тут надо будет сделать баннер для донатов-->
  <div class="donut">
    <div class="donut__content">
      <div class="donut__title">
        Поддержите перевод документации <br />
        на русский язык!
      </div>
      <p>
        Если документация помогла вам и оказалась полезна - вы можете поддержать
        автора, угостив его парой бокалов пива 🍺 через сервис
        <a href="https://donatty.com/insayt" target="_blank"> donatty.</a>
        <br />
        Либо внести свой вклад в перевод пул реквестом на
        <a href="https://github.com/Insayt/nestjs.ru.com" target="_blank">
          гитхабе
        </a>
      </p>
    </div>
    <img class="donut__img" src="/donut.png" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello this is <demo-component>",
    };
  },
};
</script>

<style>
.donut {
  display: block;
  padding: 30px;
  border: 1px solid black;
  position: relative;
  text-decoration: none;
  overflow: hidden;
  background-color: #131315;
  border-radius: 10px;
}
.donut:hover {
  text-decoration: none !important;
}
.donut__img {
  position: absolute;
  top: -10px;
  right: -40px;
  width: 350px;
  z-index: 1;
  opacity: 0.3;
}
.donut__content {
  color: white;
  position: relative;
  z-index: 2;
}
.donut__title {
  font-size: 24px;
  font-weight: bold;
}
</style>
