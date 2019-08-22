<template>
  <!-- 福利中心以及抽奖页面 -->
  <div id="welfare" style="display: block">
    <!-- 福利中心主页面 -->
    <header>
      <img id="back" src="/static/imgs/navigation_return_normal.png" alt @click="back()" />
      <h1>福利中心</h1>
    </header>
    <section>
      <!-- 签到 -->
      <div class="check-day">
        <div class="days">
          <div class="days-continue">
            <h2>
              连续签到<span class="get-day">{{continueDay}}</span>天
            </h2>
            <p>即可获取鱼蛋</p>
          </div>
          <div :class="`days-button ${isSign ? 'complete_checkIn' : ''}`">{{ isSign ? '已签到' : '签到'}}</div>
        </div>
        <div class="days-cal">
          <ul class="checkInEveryDay">
            <li
              v-for="(list, index) in dayList"
              :key="list._id"
              :class="`cal-item ${list.status == 0 ? '' : 'checked'}`"
            >
              <div class="arc">
                <span>+{{ list.reward.coupon }}</span>
                <img src="/static/imgs/鱼蛋.png" alt />
              </div>
              <p>
                <i class="iconfont icon-ok1"></i>
                {{ mapDayList[index] }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 任务和抽奖 -->
      <div class="task">
        <div class="my-task">
          <h2>我的任务</h2>
          <p>
            <span>{{ willReceive }}</span>项奖励待领取
          </p>
        </div>
        <div class="lottery">
          <h2>转盘抽奖</h2>
          <p @click="show()">点击抽奖</p>
        </div>
      </div>
      <!-- 领奖列表 -->
      <div class="receive-price">
        <ul>
          <div id="list_task">
            <li class="price-item" v-for="(list, index) in listTask" :key="index">
              <div class="price-title">
                <img :src="`/static/imgs/${mapImgList[index]}.png`" alt />
                <div class="price-des">
                  <h2>{{list.title}}</h2>
                  <p>{{list.subtitle}}</p>
                </div>
              </div>
              <div
                class="to-see"
                :class="listStatusBtn[list.status].class"
                data-id="1"
                @click="dealListTask(list)"
              >{{ listStatusBtn[list.status].msg }}</div>
            </li>
          </div>
          <li class="price-item">
            <div class="price-title">
              <img src="/static/imgs/广告.png" alt />
              <div class="price-des">
                <h2>看广告拿好礼</h2>
                <p>本次奖励100金券100经验</p>
              </div>
            </div>
            <div
              class="to-see ad_task"
              :class="adBtn ? '' : 'complete'"
              data-id="1"
              @click="dealAdTask()"
            >{{ adBtn ? '去看看' : '已领取' }}</div>
          </li>
        </ul>
      </div>
      <!-- 看广告领金券 -->
      <div class="see-ad">
        <h1>看广告, 领金券</h1>
        <p>[广告收益补贴正版权益]</p>
        <div class="task-line">
          <ul class="dots">
            <li class="receive-dots" style="visibility: hidden;"></li>
            <li
              v-for="(dots, index) in rewardDots"
              :class="`receive-dots ${dots ? 'money' : ''} ${(process > index) ? 'complete' : ''}`"
              :key="index"
            >
              <template v-if="dots">
                <p class="reward-amount">{{ index + 1 }}</p>
                <p>金券</p>
              </template>
            </li>
          </ul>
          <ul class="lines">
            <li
              v-for="(dots, index) in rewardDots"
              :class="(process > index) ? 'complete' : ''"
              class="receive-lines"
              :key="index"
            ></li>
          </ul>
        </div>

        <div class="reward-btn">
          <p>
            累计有效点击
            <span>3</span>次可领取
            <span>5</span>金券
          </p>
          <div class="receive" @click="receiveReward()" :class="adReward ? 'active' : ''">
              {{ adRewardText ? '已领取' : '领取' }}
          </div>
        </div>
        <div class="rules">
          <p>参与规则:</p>
          <p>1. 点击客户端任意广告进入页面, 并停留3秒以上算有效点击</p>
          <p>2. 同一位置广告30秒内只记录有效点击</p>
          <p>3. 累计点击在次日清零, 请及时领取</p>
        </div>
      </div>
    </section>
    <!-- 抽奖页面 -->
    <div class="sweepstakes" v-if="showLottery" @touchmove.stop.prevent>
      <!-- 抽奖 -->
      <div class="sweepstakes-wrap" v-if="showLotteryWrap">
        <div class="bg-img">
          <h2>签到成功</h2>
          <div class="lottery-box" ref="lottery">
            <template v-for="(item, index) in gift">
              <template v-if="index !== 4">
                <div :class="`lottery-item ${index == 0 ? 'active' : ''}`" :key="index">
                  <img src="/static/imgs/抽奖/金券图标.png" alt />
                  <p>
                    <span>{{ item.num }}</span>金券
                  </p>
                </div>
              </template>
              <template v-else>
                <div @click="startLottery()" class="lottery-item lottery-btn" :key="index"></div>
              </template>
            </template>
          </div>
          <img
            @click="showLottery = false"
            class="close-btn"
            src="/static/imgs/抽奖/global_close_normal1.png"
            alt
          />
        </div>
      </div>
      <!-- 领奖页面 -->
      <div class="receive-reward" v-show="showReward.show">
        <div class="receive-reward-bg"></div>
        <p class="p1">恭喜你, 中奖了</p>
        <p class="p2">
          获得<span>{{ showReward.reward }}</span>金券
        </p>
        <div class="ok" @click="controls()">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../config/api";
import $ from "jquery";

export default {
  name: "Welfare",
  data() {
    return {
      username: JSON.parse(localStorage.getItem("curUser") || "{}").username,
      isSign: false,
      signTask: [],
      gift: [],
      showLottery: false,
      showLotteryWrap: false,
      showReward: { show: false },
      dayList: [],
      mapDayList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      listTask: [],
      mapImgList: ["广告", "更新", "免费专区复制", "免费专区", "阅读计划"],
      listClickCount: 0,
      listStatusBtn: {
        "1": { msg: "去看看", class: "" },
        "2": { msg: "领取", class: "receive" },
        "3": { msg: "已完成", class: "complete" }
      },
      willReceive: 0,
      task: [],
      adTask: [],
      rewardDots: [],
      adTaskFinishTimes: [],
      clickCount: +(localStorage.getItem("count") || "0"),
      adReward: false,
      adRewardText: false,
      process: 0,
      showActive: false,
      adTaskWillReceiveCount: 0,
      adBtn: true
    };
  },
  computed: {
      continueDay () {
          return this.dayList.reduce((prev, cur) => cur.status == 1 ? ++ prev : prev, 0)
      }
  },
  mounted() {
    this.getTask();
    if (!this.username) {
      this.$router.push("/");
    }
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    show() {
      this.showLottery = true;
      this.showLotteryWrap = true;
    },
    controls() {
      this.showReward.show = false;
      this.showLottery = false;
    },
    startLottery() {
      let index = 0;
      let quan = 0;
      let order = [1, 2, 5, 8, 7, 6, 3, 0];
      let $lottery_item = $(".lottery-item");
      let timer = setInterval(() => {
        $lottery_item
          .eq(order[index++])
          .addClass("active")
          .siblings()
          .removeClass("active");
        if (index > order.length - 1) {
          index = 0;
          if (++quan === 2) {
            clearInterval(timer);
            this.sendRewardOk(index);
          }
        }
      }, 500);
    },
    async sendRewardOk(index) {
      let id = this.gift[4]._id;
      let giftId = this.gift[index].id;
      let status = "3";
      let res = await api.finishLottery({ id, giftId, status });
      if (res.status == 200) {
        this.showLotteryWrap = false;
        this.showReward = { show: true, reward: this.gift[index].num };
      }
    },
    async getTask(fn) {
      let results = await api.getTask(
        `/api/task/getUserTask?username=${this.username}`
      );
      let { status, result } = results.data;
      if (status == 200) {
        this.task = result;
        this.devideTask(result);
        this.dealSignTask();
        // this.getLotteryInfo();
        fn && fn.call(this);
      }
    },
    devideTask(task) {
      let [signTask, listTask, adTask] = [[], [], []];
      for (let i = 0; i < task.length; i++) {
        let cur = task[i];
        if (cur.taskId === 11) {
          signTask.push(cur);
        } else if (cur.taskId === 16 || cur.taskId === 17) {
          adTask.push(cur);
        } else {
          cur.clickCount = 0;
          listTask.push(cur);
        }
      }
      [this.signTask, this.listTask, this.adTask] = [
        signTask,
        listTask,
        adTask
      ];
    },
    async dealSignTask() {
      let { status, taskId } = this.signTask[0];
      if (status == 1) {
        let res = await api.finishTask({
          username: this.username,
          status: "3",
          taskId
        });
        if (res.data.status == 200) {
          this.isSign = true;
          this.getLotteryInfo();
          this.getTask(this.dealWeekend);
        }
      } else {
        this.isSign = true;
        this.getLotteryInfo();
        // this.showLottery = true;
        // this.showLotteryWrap = true;
        this.dealWeekend();
        // this.getTask(this.dealWeekend);
      }
    },
    dealWeekend() {
      this.dayList = this.signTask[0].list;
      this.willReceive = this.task.reduce(
        (prev, cur) => (cur.status == 2 ? ++prev : prev),
        0
      );
      this.renderAdTask();
    },
    renderAdTask() {
      let taskNum = (this.adTaskFinishTimes = this.adTask.map(
        v => v.condition.taskNum
      ));
      this.maxClickCount = Math.max(...taskNum);
      this.rewardDots = new Array(this.maxClickCount)
        .fill(false)
        .map((v, i) => taskNum.includes(i + 1));
      let count = this.adTask.filter(v => v.status == 2).length; // 广告任务中状态2出现的次数
      let count1 = this.adTask.filter(v => v.status == 1).length;
      let count3 = this.adTask.filter(v => v.status == 3).length;
      if (count1 == 0) {
          this.adBtn = false;
      }
      if (count3 == 2) {
          this.adRewardText = true;
      }
      this.adTaskWillReceiveCount = count;
      let times = count * 3;
      console.log(this.clickCount);
      this.process = Math.max(times, this.clickCount);
      if (times >= 3) {
        this.adReward = true;
      }
    },
    async getLotteryInfo() {
      let res = await api.lottery(
        "/api/task/lottery?username=" + this.username
      );
      console.log(res);
      let {
        status,
        result: { gift }
      } = res.data;
      console.log(status);
      if (status == 200) {
        gift.splice(4, 0, { _id: res.data.result._id });
        this.gift = gift;
      }
    },
    async dealListTask(cur) {
      let {
        status,
        taskId,
        condition: { taskNum }
      } = cur;
      if (status == 3) return;
      if (status == 1 && ++cur.clickCount == taskNum) {
        let res = await api.finishTask({
          status: "2",
          taskId,
          username: this.username
        });
        if (res.status == 200) {
          cur.status = "2";
          this.willReceive++;
        }
      } else if (status == 2) {
        let res = await api.finishTask({
          status: "3",
          taskId,
          username: this.username
        });
        if (res.status == 200) {
          cur.status = "3";
          this.willReceive = --this.willReceive < 0 ? 0 : this.willReceive;
        }
      }
    },
    async dealAdTask() {
      if (!this.adBtn || this.clickCount >= this.maxClickCount) return this.adBtn = false;
      this.setAdClickCount(++this.clickCount);
      this.process = this.clickCount;
      if (this.adTaskFinishTimes.includes(this.clickCount)) {
        let cur = this.adTask.find(v => v.condition.taskNum == this.clickCount);
        let { taskId } = cur;
        let res = await api.finishTask({
          status: "2",
          taskId,
          username: this.username
        });
        if (res.status == 200) {
          this.adReward = true;
          cur.status = '2';
          this.adTaskWillReceiveCount ++;
        }
      }
    },
    async receiveReward () {
        if (!this.adTaskWillReceiveCount) return;
        this.adTask = this.adTask.filter(v => v.status == 2).sort((a, b) => a - b);
        let cur = this.adTask[--this.adTaskWillReceiveCount];
        let res = await api.finishTask({ username: this.username, status: '3', taskId: cur.taskId });
        if (res.status == 200) {
            this.process = this.adTaskWillReceiveCount * 3;
            this.process == 0 && (this.adRewardText = true) && (this.adReward = false);
            this.setAdClickCount(this.process);
            cur.status = '3';
            this.willReceive --;
        }
    },
    getAdClickCount() {
      return +(localStorage.getItem("count") || "0");
    },
    setAdClickCount(value) {
      localStorage.setItem("count", String(value));
    }
  }
};
</script>

<style>
/* 福利中心主页面 */
#welfare header {
  width: 100%;
  height: 0.48rem;
  position: relative;
  box-shadow: 0 2px 3px 0 rgba(213, 213, 213, 0.27);
}
#welfare header img {
  width: 0.24rem;
  height: 0.24rem;
  position: absolute;
  left: 0.09rem;
  top: 0.12rem;
}
#welfare header h1 {
  text-align: center;
  font-size: 0.17rem;
  line-height: 0.48rem;
  font-family: PingFangSC-Medium;
}
#welfare section {
  padding-bottom: 0.8rem;
  box-sizing: border-box;
}
.check-day {
  padding: 0.18rem 0.18rem 0 0.18rem;
}
.days {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.12rem;
}
.days-continue h2 {
  font-size: 0.15rem;
  color: #19191b;
}
.days-continue p {
  font-size: 0.12rem;
  color: #c8c8c8;
}
.days-continue .get-day {
  color: red;
}
.days-button {
  width: 0.64rem;
  height: 0.28rem;
  background: #ffa313;
  border-radius: 1rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.13rem;
  line-height: 0.28rem;
}
.days-button.complete_checkIn {
  background: #d6d6d6;
}
.days-cal ul {
  display: flex;
  height: 0.71rem;
  box-sizing: border-box;
  justify-content: space-between;
  padding-bottom: 0.12rem;
  border-bottom: 1px solid #efeff0;
}
.cal-item {
  width: 0.42rem;
  /* height: 0.42rem; */
  box-sizing: border-box;
  text-align: center;
  /* border: 1px solid black; */
}
.cal-item.checked {
  opacity: 0.47;
}
.cal-item.checked i {
  display: inline-block;
}
.cal-item .arc {
  height: 0.42rem;
  background: #efeff0;
  border-radius: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.cal-item .arc span {
  color: #19191b;
  width: 100%;
  display: block;
  height: 0.17rem;
  font-size: 0.15rem;
}
.cal-item .arc img {
  display: block;
  width: 0.18rem;
  height: 0.18rem;
}
.cal-item > p {
  color: #82848b;
  font-size: 0.1rem;
}
.cal-item > p > i {
  color: #3c9dfb;
  font-size: 0.12rem;
  height: 0.051rem;
  display: none;
}
.task {
  /* border: 1px solid red; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.18rem;
}
.task > div {
  width: 1.6rem;
  height: 0.83rem;
  margin: 0.12rem 0 0.06rem;
  box-sizing: border-box;
  padding: 0.24rem 0.195rem;
  box-shadow: 0 2px 5px 0 rgba(213, 213, 213, 0.27);
}
.task .my-task {
  background: url("/static/imgs/我的任务.png") no-repeat center center;
  background-size: 100% 100%;
}
.task > div h2 {
  color: #19191b;
  font-size: 0.15rem;
  font-weight: 700;
  margin-bottom: 0.03rem;
}
.task > div p {
  box-sizing: border-box;
  color: #fee434;
  width: 0.95rem;
  height: 0.22rem;
  font-size: 0.12rem;
  background: #19191b;
  border-radius: 0.11rem;
  line-height: 0.22rem;
  padding-left: 0.055rem;
}
.task .lottery {
  width: 1.57rem;
  height: 0.79rem;
  background: url("/static/imgs/鱼蛋兑换.png") no-repeat center center;
  background-size: 100% 100%;
}
.task .lottery p {
  padding: 0;
  width: 0.66rem;
  color: #81cdff;
  text-align: center;
}
.receive-price ul {
  display: flex;
  flex-flow: column wrap;
}
.price-item {
  height: 0.66rem;
  box-sizing: border-box;
  /* border: 1px solid black; */
  padding: 0.12rem 0.221rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price-title {
  display: flex;
  width: 80%;
  align-items: center;
}
.price-title > img {
  width: 0.42rem;
  height: 0.42rem;
  margin-right: 0.109rem;
}
.price-title .price-des {
  display: flex;
  height: 0.38rem;
  flex-wrap: wrap;
  align-content: space-between;
}
.price-title .price-des h2 {
  font-size: 14px;
  width: 100%;
  color: #19191b;
}
.price-title .price-des p {
  font-size: 12px;
  color: #82848b;
}

.price-item .to-see {
  width: 0.64rem;
  height: 0.28rem;
  background: rgba(60, 157, 251, 0.1);
  border-radius: 100px;
  color: #3c9dfb;
  font-size: 0.12rem;
  text-align: center;
  line-height: 0.28rem;
  font-family: PingFangSC-Medium;
}
.price-item .to-see.receive {
  background: #ffa313;
  color: white;
}
.price-item .to-see.complete {
  background: #d6d6d6;
  color: white;
}

#welfare section .see-ad {
  margin: 0 auto;
  width: 3.2rem;
  height: 3rem;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.08rem;
  overflow: hidden;
}
.see-ad > h1 {
  height: 0.14rem;
  margin: 0.15rem 0 0.096rem;
  text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 0.16rem;
  color: #19191b;
}
.see-ad > p {
  text-align: center;
  font-size: 0.13rem;
  color: #e2bd74;
}
.see-ad .task-line {
  margin: 0.3rem auto;
  width: 2.8rem;
  height: 0.04rem;
  background: #efeff0;
  border-radius: 100px;
  position: relative;
}
.task-line > ul {
  position: absolute;
  width: 100%;
  height: 0.04rem;
  display: flex;
  justify-content: space-between;
}
.task-line .receive-lines {
  flex: 1;
}
.task-line .receive-dots {
  position: relative;
  top: -0.04rem;
  width: 0.12rem;
  height: 0.12rem;
  background: #efeff0;
  border-radius: 50%;
}
.task-line .complete {
  background: #e2bd74;
}
.task-line .complete.money {
  background: #ffa313;
  border: 0.02rem solid #ffcd00;
}
.task-line .receive-dots.money {
  z-index: 100;
  width: 0.282rem;
  /* position: absolute; */
  color: white;
  font-size: 0.08rem;
  text-align: center;

  top: -0.141rem;
  height: 0.282rem;
}
.task-line .receive-dots.money .reward-amount {
  font-size: 0.14rem;
  height: 0.14rem;
}
.reward-btn {
  padding: 0 0.18rem;
  box-sizing: border-box;
  overflow: hidden;
}
.reward-btn p {
  font-size: 0.12rem;
  line-height: 0.26rem;
  color: #82848b;
  float: left;
}
.reward-btn .receive {
  float: right;
  width: 0.75rem;
  height: 0.26rem;

  background: #d6d6d6;
  border-radius: 100px;
  text-align: center;
  line-height: 0.26rem;
  font-size: 0.12rem;
  color: #ffffff;
}
.reward-btn .receive.active {
  background: #ffa313;
}
#welfare section .rules {
  margin: 0.34rem auto 0;
  width: 2.85rem;
  height: 1rem;
  background: #f5f5f7;
  border-radius: 0.04rem;
  box-sizing: border-box;
  padding: 0.034rem 0.135rem;
}
#welfare section .rules p {
  font-size: 0.1rem;
  line-height: 0.18rem;
  color: #82848b;
}

/* 抽奖活动页面 */
.sweepstakes {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 100%;
  /* opacity: 0.5; */
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
}
.sweepstakes-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.sweepstakes .bg-img {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: relative;
  background: url(/static/imgs/抽奖/背景1.png) no-repeat center center;
  background-size: 100% 100%;
  width: 3.02rem;
  height: 3.377rem;
}
.bg-img > h2 {
  /* border: 1px solid red; */
  width: 1.442rem;
  height: 0.391rem;
  line-height: 0.391rem;
  position: absolute;
  color: white;
  left: 50%;
  top: 0.1rem;
  font-size: 0.2rem;
  transform: translate(-50%);
}
.bg-img .lottery-box {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  position: absolute;
  padding: 0.8rem 0.17rem 0.33rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-content: space-around;
}
.lottery-box > .lottery-item {
  background-image: url("/static/imgs/抽奖/抽奖格子1.png");
  background-position: center center;
  background-repeat: no-repeat no-repeat;
  background-size: 100% 100%;
  width: 0.88rem;
  height: 0.73rem;
  box-sizing: border-box;
}
.lottery-box > .lottery-item.active {
  border: 0.03rem solid #ffe100;
  border-radius: 0.11rem;
}
.lottery-box > .lottery-item > img {
  margin: 0.04rem 0;
  width: 60%;
}
.lottery-box > .lottery-item > p {
  /* padding-top: 0.04rem; */
  font-size: 0.14rem;
}
.lottery-box > .lottery-item:nth-child(2n) {
  background-image: url("/static/imgs/抽奖/抽奖格子2.png");
}
.lottery-box > .lottery-item.lottery-btn {
  background-image: url(/static/imgs/抽奖/抽奖按钮.png);
}

.lottery-box > .lottery-item.lottery-btn.complete {
  /* background-image: url('../imgs/抽奖/抽奖格子2.png'); */
  filter: grayscale(100%);
}

.sweepstakes .close-btn {
  /* margin-top: 0.53rem; */
  position: absolute;
  bottom: -0.7rem;
  left: 0;
  right: 0;
  margin: auto;
  width: 0.44rem;
  height: 0.45rem;
}

/* 领奖 */
.receive-reward {
  width: 2.97rem;
  height: 2.81rem;
  margin: 1.491rem auto;
  background-color: white;
  border-radius: 0.09rem;
  overflow: hidden;
}
.receive-reward-bg {
  width: 100%;
  height: 0.955rem;
  background: url(/static/imgs/抽奖/成功背景.png) no-repeat center top;
  background-size: 100% 100%;
}
.receive-reward > p {
  text-align: center;
  margin: auto;
}
.receive-reward > .p1 {
  font-size: 0.2rem;
  width: 1.4rem;
  height: 0.28rem;
  color: #2b2b2b;
  margin-top: 0.164rem;
}
.receive-reward > .p2 {
  margin-top: 0.02rem;
  font-size: 0.15rem;
  color: #373737;
  width: 1.06rem;
  height: 0.53rem;
}
.receive-reward > .p2 > span {
  color: #ffcd00;
  font-size: 0.24rem;
}
.receive-reward .ok {
  margin: 0.25rem auto;
  width: 1.9rem;
  height: 0.36rem;
  background: #1f92ff;
  border-radius: 0.04rem;
  line-height: 0.36rem;
  color: white;
  font-size: 0.15rem;
}
</style>