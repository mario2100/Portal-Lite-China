import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
// import ErrorTip from '../Common/ErrorTip';
// import Loading from '../Common/Loading';
import Timezones from './Timezones';
// http://worldtimeapi.org/api/ip 根据IP地址获取当地时间
// http://worldtimeapi.org/api/timezone 获取时区列表
const StyledWrapper = styled.section`
  position: relative;
  height: 100%;
  background-color: #1b1c1e;
  user-select: none;
  &:hover {
    .expand_icon {
      opacity: 1;
    }
  }
  .empty {
    font-size: 0.2rem;
    color: #666;
  }

  .clocks {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 100%;
    /* padding-left: 0.2rem; */
    .clock {
      display: flex;
      flex-direction: column;
      align-items: center;
      .react-clock {
        transition: all 0.6s;
      }
      .react-clock__hand {
        .react-clock__second-hand__body {
          background-color: #ef9829;
        }
      }
      .react-clock__face {
        background: #fff;
        border-color: #666;
        .react-clock__minute-mark .react-clock__mark__body {
          background-color: #ccc;
        }
      }
      &.dark {
        .react-clock__hand {
          .react-clock__minute-hand__body,
          .react-clock__hour-hand__body {
            background-color: #eef;
          }
        }
        .react-clock__face {
          border-color: #999;
          background: #333436;
          .react-clock__minute-mark {
            .react-clock__mark__body {
              background-color: #666;
            }
          }
          .react-clock__hour-mark {
            .react-clock__mark__body {
              border-radius: 4px;
              background-color: #fff;
            }
          }
        }
      }
      .city {
        font-weight: 800;
        color: #fff;
        font-size: 0.14rem;
        padding: 0.2rem;
      }
      .datetime {
        opacity: 0;
        transition: opacity 0.5s;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: -0.2rem;
        .item {
          font-size: 0.12rem;
          color: #aaa;
          line-height: 1.4;
        }
      }
      &:hover {
        .react-clock {
          transform: translateY(-10px);
        }
        .datetime {
          opacity: 1;
        }
      }
    }
  }
`;
let initialData = [
  {
    tz: 'Asia/Shanghai',
    city: '北京'
  },
  {
    tz: 'Europe/London',
    city: '伦敦'
  },
  {
    tz: 'America/Detroit',
    city: '底特律'
  }
];
let locaKey = 'SETTING_TIMEZONE_CLOCK';
try {
  let localData = localStorage.getItem(locaKey);
  initialData = JSON.parse(localData) || initialData;
} catch (error) {
  console.log({ error });
}
export default function TimezoneClock() {
  const [date, setDate] = useState(new Date());
  const [timezones, setTimezones] = useState(initialData);
  console.log({ timezones });
  const updateCurrTimezones = (tzs) => {
    localStorage.setItem(locaKey, JSON.stringify(tzs));
    setTimezones(tzs);
  };

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  // if (loading) return <Loading />;
  // if (errTip) return <ErrorTip tip={errTip} />;
  return (
    <StyledWrapper>
      {/* {loading && <Loading />} */}
      <Timezones currTimezones={timezones} updateTimezones={updateCurrTimezones} />
      {timezones.length == 0 ? (
        <div className="empty">快去添加一个时钟吧！</div>
      ) : (
        <div className="clocks">
          {timezones.map((item) => {
            const { tz, city } = item;
            const localDate = utcToZonedTime(date.getTime(), tz);
            console.log({ localDate });
            let hours = localDate.getHours();
            console.log({ hours });
            let night = hours < 6 || hours >= 18;
            let timeStr = format(localDate, 'pp');
            let dateStr = format(localDate, 'PPPP');
            return (
              <div className={`clock ${night ? 'dark' : ''}`} key={tz}>
                <Clock size={window.innerWidth < 860 ? 110 : 120} value={localDate} />
                <h2 className="city">{city}</h2>
                <h3 className="datetime">
                  <span className="item">{dateStr}</span>
                  <span className="item">{timeStr}</span>
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </StyledWrapper>
  );
}
