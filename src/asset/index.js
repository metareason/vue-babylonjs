import '@babylonjs/loaders';
import { SceneLoader, TransformNode } from '@babylonjs/core';
import Entity from '../entity';

export default {
  mixins: [Entity],

  props: {
    src: {
      type: String,
      default: null,
    },
  },

  watch: {
    src() {
      this.loadAssetContainer();
    },
  },

  methods: {
    // async loadAssetContainer() {
    //   if (!this.src) {
    //     return;
    //   }
    //   await this._$_sceneReady;
    //   let assetContainer = await SceneLoader.LoadAssetContainerAsync(this.src);
    //   await this._$_parentReady;
    //   if (assetContainer.meshes.length > 1) {
    //     this.$replace(assetContainer.createRootMesh());
    //   } else {
    //     this.$replace(assetContainer.meshes[0]);
    //   }
    //   assetContainer.addAllToScene();
    // },

    // @jeremy.dou 2020-05-14
    // async loadAssetContainer() {
    //   if (!this.src) {
    //     return;
    //   }
    //   await this._$_sceneReady;
    //   let assetContainer = await SceneLoader.LoadAssetContainerAsync(this.src);
    //   await this._$_parentReady;
    //   if (assetContainer.meshes.length > 1) {
    //     // this.$replace(assetContainer.createRootMesh());
    //     let transformNode = new TransformNode(this.name, this.$scene);
    //     assetContainer.meshes.forEach((m) => {
    //       m.setParent(transformNode);
    //     });
    //     this.$replace(transformNode);
    //   } else {
    //     this.$replace(assetContainer.meshes[0]);
    //   }
    //   assetContainer.addAllToScene();
    // },

    // @fleur 2020-05-15
    async loadAssetContainer() {
      if (!this.src) {
        return;
      }
      await this._$_sceneReady;
      let assetContainer = await SceneLoader.LoadAssetContainerAsync(this.src);
      await this._$_parentReady;
      // keep mesh hierarchy @Jeremy 2020-05-19
      assetContainer.meshes.forEach((m) => {
        if (m.parent === null) {
          m.setParent(this.$entity);
        }
      });
      assetContainer.addAllToScene();
      // this.$replace(this.$entity);
    },
  },

  mounted() {
    this.loadAssetContainer();
  },
};
