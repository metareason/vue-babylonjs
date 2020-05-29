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
    //   const assetContainer = await SceneLoader.LoadAssetContainerAsync(this.src);
    //   await this._$_parentReady;
    //   // console.log('assetContainer', assetContainer);
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

    // @fleur 2020-05-26
    async loadAssetContainer() {
      if (!this.src) {
        return;
      }
      await this._$_sceneReady;
      this.assetContainer = await SceneLoader.LoadAssetContainerAsync(this.src);
      await this._$_parentReady;
      // console.log('asset container', this.assetContainer);
      // if (this.assetContainer.meshes.length > 1) {
      //   this.assetContainer.createRootMesh();
      // }
      // const transformNode = new TransformNode(this.name, this.$scene);
      this.assetContainer.meshes.forEach((m) => {
        // https://doc.babylonjs.com/how_to/parenting
        // The order you set transformations, such as position or rotation, to the parent mesh will affect the result using methods 2 and 3 above.
        if (m.parent === null) {
          // m.setParent(transformNode);
          m.parent = this.$entity;
        }
      });
      // this.$replace(transformNode); // no! parent / children inheritance broken
      // this._$_hookArgs.entity = null;
      // Object.assign(transformNode, this._$_hookArgs);
      // this.$entity = transformNode; // no! then you have 2 transform nodes with the same id
      // this._$_init(); // resets the parent with on transform
      this.assetContainer.addAllToScene();
    },
  },

  mounted() {
    this.loadAssetContainer();
  },

  beforeDestroy() {
    if (this.assetContainer) {
      this.assetContainer.dispose();
      this.assetContainer = null;
    }
  },
};
