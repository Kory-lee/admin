import { MenuEventEnum, TabContentProps } from './types';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMultipleTabsStore } from '/@/store/modules/multipleTabs';
import { useTabs } from '/@/hooks/web/useTabs';
import { computed, ComputedRef, reactive, unref } from 'vue-demi';
import { DropMenu } from '/@/components/Dropdown';

export function useTabDropdown(tabContentProps: TabContentProps, getIsTabs: ComputedRef<boolean>) {
  const state = reactive({
    current: null as Nullable<RouteLocationNormalized>,
    currentIndex: 0,
  });
  const { t } = useI18n(),
    tabStore = useMultipleTabsStore(),
    { currentRoute } = useRouter(),
    { refreshPage, closeAll, closeCurrent, closeLeft, closeRight, closeOther } = useTabs();

  const getTargetTab = computed(
    (): RouteLocationNormalized =>
      unref(getIsTabs) ? tabContentProps.tabItem : unref(currentRoute)
  );

  const getDropMenuList = computed(() => {
    if (!unref(getTargetTab)) return;
    const { meta } = unref(getTargetTab),
      { path } = unref(currentRoute);

    const curItem = state.current,
      index = state.currentIndex,
      refreshDisabled = curItem ? curItem.path !== path : true;

    const closeLeftDisabled = index === 0,
      disabled = tabStore.getTabList.length === 1,
      closeRightDisabled =
        index === tabStore.getTabList.length - 1 && tabStore.getLastDragEndIndex >= 0;

    const dropMenuList: DropMenu[] = [
      {
        icon: 'ion:reload-sharp',
        event: MenuEventEnum.REFRESH_PAGE,
        text: t('layout.multipleTab.reload'),
        disabled: refreshDisabled,
      },
      {
        icon: 'clarity:close-line',
        event: MenuEventEnum.CLOSE_CURRENT,
        text: t('layout.multipleTab.close'),
        disabled: !!meta?.affix || disabled,
        divider: true,
      },
      {
        icon: 'line-md:arrow-close-left',
        event: MenuEventEnum.CLOSE_LEFT,
        text: t('layout.multipleTab.closeLeft'),
        disabled: closeLeftDisabled,
        divider: false,
      },
      {
        icon: 'line-md:arrow-close-right',
        event: MenuEventEnum.CLOSE_RIGHT,
        text: t('layout.multipleTab.closeRight'),
        disabled: closeRightDisabled,
        divider: true,
      },
      {
        icon: 'dashicons:align-center',
        event: MenuEventEnum.CLOSE_OTHER,
        text: t('layout.multipleTab.closeOther'),
        disabled: disabled,
      },
      {
        icon: 'clarity:minus-line',
        event: MenuEventEnum.CLOSE_ALL,
        text: t('layout.multipleTab.closeAll'),
        disabled: disabled,
      },
    ];
    return dropMenuList;
  });

  function handleContextMenu(tabItem: RouteLocationNormalized) {
    return (e: Event) => {
      if (!tabItem) return;
      e?.preventDefault();
      const index = tabStore.getTabList.findIndex((item) => item.path === tabItem.path);
      state.current = tabItem;
      state.currentIndex = index;
    };
  }
  async function handleMenuEvent(menu: DropMenu): Promise<void> {
    const { event } = menu;
    switch (event) {
      case MenuEventEnum.REFRESH_PAGE:
        await refreshPage();
        break;
      case MenuEventEnum.CLOSE_CURRENT:
        await closeCurrent(tabContentProps.tabItem);
        break;
      case MenuEventEnum.CLOSE_LEFT:
        await closeLeft();
        break;
      case MenuEventEnum.CLOSE_RIGHT:
        await closeRight();
        break;
      case MenuEventEnum.CLOSE_ALL:
        await closeAll();
        break;
      case MenuEventEnum.CLOSE_OTHER:
        await closeOther();
        break;
    }
  }
  return { getDropMenuList, handleMenuEvent, handleContextMenu };
}
