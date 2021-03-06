<template>
  <Dropdown :trigger="trigger" v-bind="$attrs">
    <span> <slot></slot> </span>

    <template #overlay>
      <Menu :selected-keys="selectedKeys">
        <template v-for="item in dropMenuList" :key="item.event">
          <MenuItem
            v-bind="getAttr(item.event)"
            :disabled="item.disabled"
            @click="handleClickMenu(item)"
          >
            <Popconfirm v-if="popconfirm && item.popConfirm" v-bind="item">
              <Icon v-if="item.icon" :icon="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </Popconfirm>
            <template v-else>
              <Icon v-if="item.icon" :icon="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </MenuItem>
          <MenuDivider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts">
  import type { DropMenu } from './types';
  import type { PropType } from 'vue';

  import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import Icon from '/@/components/Icon';

  export default defineComponent({
    name: 'BasicDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: Menu.Item,
      MenuDivider: Menu.Divider,
      Icon,
      Popconfirm,
    },
    props: {
      popconfirm: Boolean,
      trigger: {
        type: [Array] as PropType<('click' | 'contextmenu' | 'hover' | string)[]>,
        default: () => ['contextmenu'],
      },
      dropMenuList: { type: Array as PropType<(DropMenu & Recordable)[]>, default: () => [] },
      selectedKeys: { type: Array as PropType<string[]>, default: () => [] },
      // ...Dropdown.props,
    },

    emits: ['menuEvent'],
    setup(props, { emit }) {
      const handleClickMenu = (item: DropMenu) => {
        const { event } = item;
        const menu = props.dropMenuList.find((item) => `${item.event}` === `${event}`);
        emit('menuEvent', menu);
        item.onClick?.();
      };
      return {
        handleClickMenu,
        getAttr: (key: string | number) => ({ key }),
      };
    },
  });
</script>
