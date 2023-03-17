<template>
  <div class="dotloader flex justify-center">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<style lang="scss" scoped>
$dotSize: .5em;
$animDelay: 0.25s;

.dotloader {
  margin: 0 auto;

  .dot {
    width: $dotSize;
    height: $dotSize;
    border-radius: $dotSize;
    background-color: rgba(255, 255, 255, 0.265);
    display: inline-block;
    margin: 0 3px;
    animation: dotanim 1.6s infinite ease-in-out;

    @for $i from 0 to 4 {
      &:nth-child(#{$i + 1}) {
        animation-delay: $animDelay * $i;
      }
    }
  }
}

@keyframes dotanim {
  0% {
    background-color: rgba(255, 255, 255, 0.265);
  }

  50% {
    background-color: white;
  }

  90% {
    background-color: rgba(255, 255, 255, 0.265);
  }

  100% {
    background-color: rgba(255, 255, 255, 0.265);
  }
}
</style>