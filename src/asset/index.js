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

  data() {
    return {
      assetContainer: null, // don't leave orphan promises on glb validators
    };
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
      this.assetContainer = await SceneLoader.LoadAssetContainerAsync(this.src);
      await this._$_parentReady;
      // keep mesh hierarchy @Jeremy 2020-05-19
      this.assetContainer.meshes.forEach((m) => {
        if (m.parent === null) {
          m.setParent(this.$entity);
        }
      });
      // @Jeremy 2020-05-20
      this._$_setPosition();
      this._$_setRotation();
      this._$_setScaling();
      this.assetContainer.addAllToScene();
      // this.$replace(this.$entity);
    },
  },

  mounted() {
    this.loadAssetContainer();
  },

  beforeDestroy() {
    this.assetContainer.dispose();
    this.assetContainer = null;
  },
};
