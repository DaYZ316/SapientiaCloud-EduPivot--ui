import * as THREE from 'three';
import type {InstancedMesh} from 'three';

type SubComponentMeshInfo = {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  originalQuaternion: THREE.Quaternion;
  originalScale: THREE.Vector3;
};

type SubComponentInfo = {
  name: string;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  meshes: SubComponentMeshInfo[];
};

export class ModelInstanceManager {
  // 识别并保存模型的子组件结构
  identifyModelStructure(object: THREE.Object3D): SubComponentInfo[] {
    const subComponents: SubComponentInfo[] = [];

    if (object.children.length > 0) {
      object.children.forEach((child: THREE.Object3D, index: number) => {
        if (child.isObject3D && !(child as THREE.Mesh).isMesh) {
          const componentInfo: SubComponentInfo = {
            name: child.name || `component_${index}`,
            position: child.position.clone(),
            quaternion: child.quaternion.clone(),
            scale: child.scale.clone(),
            meshes: []
          };

          this.collectMeshesInComponent(child, componentInfo.meshes);

          if (componentInfo.meshes.length > 0) {
            subComponents.push(componentInfo);
          }
        }
      });
    }

    if (subComponents.length === 0) {
      const defaultMeshes: SubComponentMeshInfo[] = [];
      this.collectMeshesInComponent(object, defaultMeshes);
      subComponents.push({
        name: 'default',
        position: new THREE.Vector3(0, 0, 0),
        quaternion: new THREE.Quaternion(),
        scale: new THREE.Vector3(1, 1, 1),
        meshes: defaultMeshes
      });
    }

    return subComponents;
  }

  // 收集组件中的所有网格
  collectMeshesInComponent(
      object: THREE.Object3D,
      meshes: SubComponentMeshInfo[] = []
  ): SubComponentMeshInfo[] {
    if ((object as THREE.Mesh).isMesh) {
      const mesh = object as THREE.Mesh;
      if (mesh.visible && mesh.geometry) {
        meshes.push({
          mesh,
          originalPosition: mesh.position.clone(),
          originalQuaternion: mesh.quaternion.clone(),
          originalScale: mesh.scale.clone()
        });
      }
    }

    for (const child of object.children) {
      this.collectMeshesInComponent(child, meshes);
    }

    return meshes;
  }

  // 创建整体模型的实例化网格集合
  createGroupedInstancedMeshes(subComponents: SubComponentInfo[], count: number): InstancedMesh[] {
    const instancedMeshGroups: InstancedMesh[] = [];

    subComponents.forEach((component) => {
      component.meshes.forEach((meshData, meshIndex) => {
        const mesh = meshData.mesh;
        try {
          const geometry = mesh.geometry;
          const material = Array.isArray(mesh.material)
              ? mesh.material.map((m: THREE.Material) => m.clone())
              : (mesh.material.clone ? mesh.material.clone() : mesh.material);

          const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
          instancedMesh.name = `${component.name}_${meshIndex}_instanced`;

          instancedMesh.castShadow = mesh.castShadow;
          instancedMesh.receiveShadow = mesh.receiveShadow;
          instancedMesh.instanceMatrix.usage = THREE.DynamicDrawUsage;

          instancedMesh.userData = {
            meshPosition: meshData.originalPosition,
            meshQuaternion: meshData.originalQuaternion,
            meshScale: meshData.originalScale,
            componentPosition: component.position.clone(),
            componentQuaternion: component.quaternion.clone(),
            componentScale: component.scale.clone(),
            componentName: component.name
          };

          instancedMeshGroups.push(instancedMesh);
        } catch (err) {
          // 静默处理创建实例化网格失败
        }
      });
    });

    return instancedMeshGroups;
  }

  // 批量设置实例矩阵 - 保持模型内部相对位置
  setInstanceMatricesAsGroup(
      instancedMeshGroups: InstancedMesh[],
      startIndex: number,
      count: number,
      positionCallback: (instanceId: number, position: THREE.Vector3) => THREE.Vector3
  ): void {
    const matrix = new THREE.Matrix4();
    const groupMatrix = new THREE.Matrix4();
    const componentMatrix = new THREE.Matrix4();
    const globalPosition = new THREE.Vector3();
    const localPosition = new THREE.Vector3();
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI/2, 0));
    const groupQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI/2, 0));
    const scale = new THREE.Vector3(1, 1, 1);

    for (let i = 0; i < count; i++) {
      const instanceId = startIndex + i;

      positionCallback(instanceId, globalPosition);

      groupMatrix.compose(globalPosition, groupQuaternion, scale);

      instancedMeshGroups.forEach((instancedMesh: InstancedMesh) => {
        componentMatrix.compose(
            instancedMesh.userData.componentPosition,
            instancedMesh.userData.componentQuaternion,
            instancedMesh.userData.componentScale
        );

        componentMatrix.premultiply(groupMatrix);

        localPosition.copy(instancedMesh.userData.meshPosition);
        localPosition.applyMatrix4(componentMatrix);

        matrix.compose(localPosition, quaternion, scale);
        instancedMesh.setMatrixAt(instanceId, matrix);
      });
    }

    instancedMeshGroups.forEach(instancedMesh => {
      instancedMesh.instanceMatrix.needsUpdate = true;
    });
  }

  // 资源清理函数
  disposeResources(instancedMeshGroups: InstancedMesh[]): void {
    instancedMeshGroups.forEach((mesh: InstancedMesh) => {
      if (mesh && mesh.dispose) {
        mesh.dispose();
      }
    });
  }
}


