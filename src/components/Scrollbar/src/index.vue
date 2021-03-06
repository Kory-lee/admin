<template>
  <div class="scrollbar">
    <div
      ref="wrap"
      :class="[wrapClass, 'scroll__wrap', { 'scrollbar__wrap--hidden-default': native }]"
      :style="wrapStyle"
      @scroll="handleScroll"
    >
      <component :is="tag" ref="resize" :class="['scrollbar__view', viewClass]" :style="viewStyle">
        <slot></slot>
      </component>
    </div>
    <template v-if="!native"> </template>
  </div>
</template>

<script lang="ts">
  import {
    provide,
    ref,
    defineComponent,
    unref,
    onMounted,
    nextTick,
    onBeforeUnmount,
  } from 'vue-demi';
  import componentSetting from '/@/settings/componentSetting';
  import { addResizeListener, removeResizeListener } from '/@/utils/event';

  const { scrollbar } = componentSetting;

  export default defineComponent({
    name: 'Scrollbar',
    props: {
      native: { type: Boolean, default: scrollbar?.native ?? false },
      wrapStyle: { type: Object, default: () => ({}) },
      wrapClass: { type: Object, default: () => ({}) },
      viewClass: { type: [String, Array, Object], default: '' },
      viewStyle: { type: [String, Array, Object], default: '' },
      noResize: Boolean, // 如果container尺寸不会发生变化,最好设置它,可以优化性能
      tag: { type: String, default: 'div' },
    },
    setup(props) {
      const sizeWidth = ref('0');
      const sizeHeight = ref('0');
      const moveX = ref(0);
      const moveY = ref(0);
      const wrap = ref();
      const resize = ref(null);

      provide('scroll-bar-wrap', wrap);

      const handleScroll = () => {
        if (props.native) return;
        moveY.value = (unref(wrap).scrollTop * 100) / unref(wrap).clientHeight;
        moveX.value = (unref(wrap).scrollLeft * 100) / unref(wrap).clientWidth;
      };

      const update = () => {
        if (!unref(wrap)) return;

        const heightPercentage = (unref(wrap).clientHeight * 100) / unref(wrap).scrollHeight;
        const widthPercentage = (unref(wrap).clientWidth * 100) / unref(wrap).scollWidth;

        sizeHeight.value = heightPercentage < 100 ? heightPercentage + '%' : '';
        sizeWidth.value = widthPercentage < 100 ? widthPercentage + '%' : '';
      };

      onMounted(() => {
        if (props.native) return;
        nextTick(update);
        if (props.noResize) return;
        addResizeListener(unref(resize), update);
        addResizeListener(unref(wrap), update);
        addEventListener('resize', update);
      });
      onBeforeUnmount(() => {
        if (props.native || props.noResize) return;

        removeResizeListener(unref(resize), update);
        removeResizeListener(unref(wrap), update);
        removeEventListener('resize', update);
      });
      return { resize, wrap, handleScroll };
    },
  });
</script>

<style lang="less">
  .scrollbar {
    position: relative;
    height: 100%;
    overflow: hidden;

    &:focus,
    &:hover,
    &:active {
      & > .scrollbar__bar {
        opacity: 1;
        transition: opacity 340ms ease-out;
      }
    }

    &__wrap {
      height: 100%;
      overflow: auto;

      &--hidden-default {
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          opacity: 0;
        }
      }
    }

    &__thumb {
      position: relative;
      display: block;
      width: 0;
      height: 0;
      cursor: pointer;
      background-color: rgba(144, 147, 153, 0.3);
      border-radius: inherit;
      transition: 0.3s background-color;

      &:hover {
        background-color: rgba(144, 147, 153, 0.5);
      }
    }

    &__bar {
      position: absolute;
      right: 2px;
      bottom: 2px;
      z-index: 1;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 80ms ease;

      &.is-vertical {
        top: 2px;
        width: 6px;

        & > div {
          width: 100%;
        }
      }

      &.is-horizontal {
        left: 2px;
        height: 6px;

        & > div {
          height: 100%;
        }
      }
    }
  }
</style>
