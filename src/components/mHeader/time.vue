<script setup lang="ts">
import { reactive } from "vue";
import dayjs from 'dayjs';
interface DateData {
    dateDay: string;
    dateYear: string;
    dateWeek: string;
}
const dateData = reactive<DateData>({
    dateDay: "",
    dateYear: "",
    dateWeek: "",
});

const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
function getdates() {
    return dateData.dateDay.split(" ") || [];
}

const timeFn = () => {
    dateData.dateDay = dayjs().format("YYYY/MM/DD HH:mm:ss");
    dateData.dateWeek = weekday[dayjs().day()];
    requestAnimationFrame(timeFn)
};
timeFn()

</script>

<template>
    <div class="timers">
        <div class="time">{{ getdates()[1] }}</div>
        <span class="split-line">|</span>
        <div class="date">
            <div> {{ dateData.dateWeek }} </div>
            <div class="year"> {{ getdates()[0] }} </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.timers {
    font-size: 18px;
    display: flex;
    align-items: center;

    .time {
        font-size: 28px;
        font-weight: 700;
        color: #fff;
    }

    .split-line {
        margin: 0 15px;
        transform: scalex(0.6);
    }

    .date {
        font-weight: bold;
        font-size: 16px;
        color: #fff;
        text-align: right;

        .year {
            color: rgba(178, 178, 178, 0.58);
            box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.25);
        }
    }
}
</style>
