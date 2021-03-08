import { computed, ref, Ref, unref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProviderContext } from '/@/components/Application';
import { getIsHorizontal, getSplit } from '/@/hooks/setting/MenuSetting';
import { MenuSplitTypeEnum } from '/@/enums/menuEnums';
import { useThrottle } from '/@/hooks/core/useThrottle';
import { getCurrentParentPath, getMenus, getShallowMenus } from '/@/router/menus';
import { MenuType } from '/@/router/types';
import { permissionStore } from '/@/store/modules';

export default function useSplitMenu(splitType: Ref<MenuSplitTypeEnum>) {
  const [throttleHandleSplitLeftMenu] = useThrottle(handleSplitLeftMenu, 50);

  const menusRef = ref<MenuType[]>([]),
    { currentRoute } = useRouter(),
    { isMobile } = useProviderContext(),
    splitNotLeft = computed(
      () => unref(splitType) !== MenuSplitTypeEnum.LEFT && !unref(getIsHorizontal)
    ),
    getSplitLeft = computed(() => !unref(getSplit) || unref(splitType) !== MenuSplitTypeEnum.LEFT),
    getSplitTop = computed(() => unref(splitType) === MenuSplitTypeEnum.TOP),
    normalType = computed(() => unref(splitType) === MenuSplitTypeEnum.NONE || !unref(getSplit));

  watch(
    [() => unref(currentRoute).path, () => unref(splitType)],
    async ([path]: [string, MenuSplitTypeEnum]) => {
      if (unref(splitNotLeft) || unref(isMobile)) return;
      const { meta } = unref(currentRoute),
        currentActiveMenu = meta.currentActiveMenu as string;
      let parentPath = await getCurrentParentPath(path);
      if (!parentPath) parentPath = await getCurrentParentPath(currentActiveMenu);
      parentPath && throttleHandleSplitLeftMenu(parentPath);
    },
    { immediate: true }
  );

  watch(
    [() => permissionStore.getLastBuildMenuTimeState, () => permissionStore.getBackMenuListState],
    () => {
      genMenus();
    },
    { immediate: true }
  );
  async function handleSplitLeftMenu(parentPath: string) {
    // TODO
    // if(unref(getSpl))
  }
  async function genMenus() {
    if (unref(normalType || unref(isMobile))) {
      menusRef.value = await getMenus();
      return;
    }
    // split top
    if (unref(getSplitTop)) {
      const shallowMenus = await getShallowMenus();
      menusRef.value = shallowMenus;
      return;
    }
  }
  return { menusRef };
}