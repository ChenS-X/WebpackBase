<template>
    <div class="container">
        <div class="left">
            <ul>
                <li @click="toHome">首页</li>
                <li @click="toAbout">关于</li>
            </ul>
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
    name: 'Layout',
    setup() {
        const router = useRouter();
        const toHome = () => {
            router.push('/home')
        }
        const toAbout = () => {
            router.push('/about')
        }

        return {
            toHome,
            toAbout
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    height:100%;
    display: flex;
    .left {
        flex-grow: 2;
        height: 100%;
        background: rgba(0, 255, 0, 0.1);
    }
    .right {
        flex-grow: 8;
        flex-shrink: 0;
        box-sizing: border-box;
        box-shadow: 0 0 2px 0 #aaa;
    }
}
</style>