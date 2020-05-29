import { Vector3, TransformNode } from '@babylonjs/core';
// import { Vector3, MeshBuilder } from '@babylonjs/core';
import AbstractEntity from '../entity/abstract';
import { vec3, toVec3 } from '../types/vector';

const { validator } = vec3;

export default {
  mixins: [AbstractEntity],

  props: {
    position: vec3,
    rotation: vec3,
    scaling: {
      validator,
      default: () => Vector3.One(),
    },
  },

  computed: {
    _$_positionVector3() {
      return toVec3(this.position);
    },

    _$_rotationVector3() {
      return toVec3(this.rotation);
    },

    _$_scalingVector3() {
      return toVec3(this.scaling);
    },
  },

  watch: {
    _$_positionVector3() {
      this._$_setPosition();
    },

    _$_rotationVector3() {
      this._$_setRotation();
    },

    _$_scalingVector3() {
      this._$_setScaling();
    },
  },

  methods: {
    _$_setPosition() {
      if (this.$entity && this.$entity.position) {
        this.$entity.position.copyFrom(this._$_positionVector3);
      }
    },

    _$_setRotation() {
      if (this.$entity && this.$entity.rotation) {
        this.$entity.rotation.copyFrom(this._$_rotationVector3);
      }
    },

    _$_setScaling() {
      if (this.$entity && this.$entity.scaling) {
        this.$entity.scaling.copyFrom(this._$_scalingVector3);
      }
    },
  },

  created() {
    Object.assign(this._$_hookArgs, {
      position: this._$_positionVector3,
      rotation: this._$_rotationVector3,
      scaling: this._$_scalingVector3,
    });
  },

  /* eslint-disable camelcase */
  _$_onTransform() {
    if (!this.$entity) {
      // assuming we don t need that
      // https://doc.babylonjs.com/how_to/using_the_physics_engine
      // revert commit
      // https://github.com/Beg-in/vue-babylonjs/commit/d57997635b99f5eb773c6e71cf9bddff6be551e9
      // this.$entity = new TransformNode(this.name, this.$scene);
      // // HACK: TransformNode does not implement IPhysicsEnabledObject, so using invisible box instead
      // let box = MeshBuilder.CreateBox(this.name, {}, this.$scene);
      // box.isVisible = false;
      // this.$entity = box;

      // @fleur 2020-05-15
      // console.log('transform node', this.name);
      const transformNode = new TransformNode(this.name, this.$scene);
      // parent / scene / ....
      // console.log('assign hook args?', this._$_hookArgs);
      // add transformations!
      Object.assign(transformNode, this._$_hookArgs);
      this.$entity = transformNode; // not really but it s what the initial code said
      // this._$_hookArgs.entity = this.$entity; // done in init
    }
    this._$_setPosition();
    this._$_setRotation();
    this._$_setScaling();
    if (!this.$entity.parent) {
      this.$entity.parent = this._$_parent;
    }
  },
};
