import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css';

//uv: tâm 90.5 80, điểm bắt đầu 52 148, 2: 18.7 105

function App() {
  const [isOn, setIsOn] = useState(true);
  const [aiOn, setAiOn] = useState(false);
  const [selectedMode, setSelectedMode] = useState('white');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [lastColor, setLastColor] = useState('');
  const [intensity, setIntensity] = useState(89); // Thêm state cho độ sáng
  const [time, setTime] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [condition, setCondition] = useState('');
  const [rainChance, setRainChance] = React.useState(null);
  const [windSpeed, setWindSpeed] = useState('');
  const [feelsLike, setFeelsLike] = useState('');
  const [uv, setUv] = useState('');
  const [icon, setIcon] = useState('');
  const [uvPointX, setUvPointX] = useState(52);
  const [uvPointY, setUvPointY] = useState(148);
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  useEffect(() => {
    setUvPointX((52 - 90.5) * Math.cos(uv*( Math.PI /10 + 0.12) - 0.2) - (148-80) * Math.sin(uv*( Math.PI /10 + 0.12) - 0.2) + 90.5);
    setUvPointY((52 - 90.5) * Math.sin(uv*( Math.PI /10 + 0.12) -0.2) + (148-80) * Math.cos(uv*( Math.PI /10 + 0.12) - 0.2) + 80);
  }, [uv]); // Dependency array chứa count

  const modes = {
    White: { label: 'Ban ngày', color: '#F5F5F5' },          // Trắng nhạt
    Black: { label: 'Ban đêm', color: '#3A5A5A' },            // Slate Gray nhẹ hơn
    Purple: { label: 'Tinh tế', color: '#A384A3' },        // Purple nhạt 
    Blue: { label: 'Thư giãn', color: '#C0D8F0' },          // Light Blue nhạt
    Green: { label: 'Yên tĩnh', color: '#98FB98' },        // Pale Green (Xanh Lá Nhạt)
    Yellow: { label: 'Vui vẻ', color: '#FFFF99' },        // Vàng nhạt  Hạnh phúc
    Red: { label: 'Kích thích', color: '#FF6666' },           // Đỏ nhạt  Năng lượng
    Cyan: { label: 'Tập trung', color: '#66CCCC' },          // Cyan nhạt
  };

  const toggleLight = () => {
    if(isOn){
      setLastColor(selectedColor);
      setSelectedColor('#000000');
    }
    else{
      setSelectedColor(lastColor);
    }
    setIsOn(!isOn);
  };

  const toggleAi = () => {
    setAiOn(!aiOn);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    if(isOn){
      setSelectedColor(modes[mode].color);
    }
    else{
      setSelectedColor('#000000');
      setLastColor(modes[mode].color);
    }
  };

  // Hàm lấy thời gian hiện tại
  const updateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Ngày
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng (getMonth() trả về từ 0-11)
    const year = now.getFullYear(); // Năm
    const hours = String(now.getHours()).padStart(2, '0'); // Giờ
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Phút
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Giây
    setTime(`${day}/${month}/${year} -- ${hours}:${minutes}:${seconds}`); // Định dạng Ngày/Tháng/Năm Giờ:Phút:Giây
};


  // Hàm lấy thông tin thời tiết từ API
  const getWeather = async () => {
    const apiKey = '5c9dc2366a6048b4976154813240312';
    const city = 'Hanoi'; 
    const url = `https://api.weatherapi.com/v1/forecast.json?q=${city}&key=${apiKey}&aqi=no`;

    const response = await fetch(url);
    const data = await response.json();

    setTemperature(data.current.temp_c);
    setCondition(data.current.condition.text);
    setHumidity(data.current.humidity);
    setWindSpeed(data.current.wind_mph);
    setFeelsLike(data.current.feelslike_c);
    setIcon(data.current.condition.icon);
    setLastUpdated(data.current.last_updated);
    setRainChance( data.forecast.forecastday[0].day.daily_chance_of_rain);
    setWindSpeed(data.current.wind_kph);
    setUv(Math.ceil(data.forecast.forecastday[0].day.uv)); 

    const url2 = `https://api.weatherapi.com/v1/astronomy.json?q=${city}&key=${apiKey}&dt=`;
    const response2 = await fetch(url2);
    const data2 = await response2.json();
    setSunrise(data2.astronomy.astro.sunrise);
    setSunset(data2.astronomy.astro.sunset);
  };

  useEffect(() => {
    // Cập nhật thời gian mỗi giây
    const interval = setInterval(updateTime, 1000);
    updateTime(); // Lần đầu tiên chạy ngay lập tức

    // Gọi API thời tiết
    getWeather();

    // Cleanup khi component unmount
    return () => clearInterval(interval);
  }, []);

  const handleIntensityChange = (value) => {
    setIntensity(value); // Cập nhật độ sáng khi người dùng thay đổi thanh trượt
  };

  return (
    <div className="main">
      <div className="infor-section">
        <div className="weather">
          <span className="weather-text">
            <i class="fa-solid fa-location-dot"></i>
            Hà Nội, Việt Nam
            </span> <br />
          <span className='time'>
            <i class="fa-solid fa-calendar-days"></i>
            {time}
            </span> <br />
          <div className="temp-div">
            <img src={icon} alt="weather condition" />
            <span className="temp">{temperature}°C</span>
          </div>
          <div className="others">
            <span>{condition}</span>
            <span className="feel-like">Feels like {feelsLike}°C</span>
          </div>
          <div className='last-update'>
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
        <div className='more'>
          <div className='small humidity'>
            <div className='hum-container'>
              <span className='humidity-text hum'> 
                <i class="fa-solid fa-droplet"></i>
                Humidity: {humidity}%
              </span>
            </div>
            <div className='rain-div'>
              <span className='humidity-text rain'> 
                <i class="fa-solid fa-cloud-rain"></i>
                Rain chance: {rainChance}%
              </span>
            </div>
            <div className='wind-div'>
              <span className='humidity-text wind'> 
                <i class="fa-solid fa-wind"></i>
                Winds: {windSpeed} km/h
              </span>
            </div>
          </div>
          <div className="small ai">
            <span>AI change</span>
            <div className={`eye ${aiOn ? "on" : "off"}`} onClick={toggleAi}>
              <i class="fa-solid fa-eye "></i>
            </div>
          </div>

          
          <div className="small">
            <div className='sun-graph'>
              <svg width="230" height="100" viewBox="0 0 258 129" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_3881_557)" transform="translate(188 60)">
                <path d="M63 61.3773C63 61.3773 60 59.8773 42.5 44.3881C33 34.3773 26.6179 28.3307 4.73328 4" class="infoLineBackground-DS-EntryPoint1-1" stroke-opacity="0.1" stroke-width="8" stroke-linecap="round"></path></g><g filter="url(#filter0_i_3881_557)" transform="translate(0 60)">
                <path d="M4 62.0002C4 62.0002 15.5 58.5001 31.3913 45.0109C38.1924 39.2378 52.0654 21.3662 66.5 4.6228" class="infoLineBackground-DS-EntryPoint1-1" stroke-opacity="0.1" stroke-width="8" stroke-linecap="round">
                </path></g>
                <line x1="3" y1="67.5" x2="253" y2="67.5" stroke="#93867F" class="infoLineBackground-DS-EntryPoint1-1" stroke-opacity="0.2" stroke-width="0.84"></line>
                <path d="M 64 65 Q 129 -42 194 65" stroke="url(#paint0_linear_4430_8884)" stroke-width="8" stroke-linecap="round"></path><g filter="url(#filter1_d_4430_8884)">
                <circle cx="63" cy="68" r="1" stroke='#CC2635' stroke-width="6" class="infoCircleBackground-DS-EntryPoint1-1"></circle>
                <circle cx="63" cy="68" r="5.5" stroke="white" stroke-width="3"></circle></g><g filter="url(#filter2_d_4430_8884)">
                <circle cx="196" cy="68" r="1" stroke='#552278' stroke-width="6" class="infoCircleBackground-DS-EntryPoint1-1"></circle>
                <circle cx="196" cy="68" r="5.5" stroke="white" stroke-width="3"></circle></g>
                <g filter="url(#filter3_d_4430_8884)" transform="translate(25.82480000000001 3.4336000000000055)">
                <rect x="116" y="2" width="26" height="26" rx="13" fill="white"></rect>
                <path d="M129 7C129.276 7 129.5 7.22386 129.5 7.5V8.5C129.5 8.77614 129.276 9 129 9C128.724 9 128.5 8.77614 128.5 8.5V7.5C128.5 7.22386 128.724 7 129 7ZM133 15C133 17.2091 131.209 19 129 19C126.791 19 125 17.2091 125 15C125 12.7909 126.791 11 129 11C131.209 11 133 12.7909 133 15ZM136.5 15.5C136.776 15.5 137 15.2761 137 15C137 14.7239 136.776 14.5 136.5 14.5H135.5C135.224 14.5 135 14.7239 135 15C135 15.2761 135.224 15.5 135.5 15.5H136.5ZM129 21C129.276 21 129.5 21.2239 129.5 21.5V22.5C129.5 22.7761 129.276 23 129 23C128.724 23 128.5 22.7761 128.5 22.5V21.5C128.5 21.2239 128.724 21 129 21ZM122.5 15.5C122.776 15.5 123 15.2761 123 15C123 14.7239 122.776 14.5 122.5 14.5H121.463C121.187 14.5 120.963 14.7239 120.963 15C120.963 15.2761 121.187 15.5 121.463 15.5H122.5ZM123.146 9.14645C123.342 8.95118 123.658 8.95118 123.854 9.14645L124.854 10.1464C125.049 10.3417 125.049 10.6583 124.854 10.8536C124.658 11.0488 124.342 11.0488 124.146 10.8536L123.146 9.85355C122.951 9.65829 122.951 9.34171 123.146 9.14645ZM123.854 20.8536C123.658 21.0488 123.342 21.0488 123.146 20.8536C122.951 20.6583 122.951 20.3417 123.146 20.1464L124.146 19.1464C124.342 18.9512 124.658 18.9512 124.854 19.1464C125.049 19.3417 125.049 19.6583 124.854 19.8536L123.854 20.8536ZM134.854 9.14645C134.658 8.95118 134.342 8.95118 134.146 9.14645L133.146 10.1464C132.951 10.3417 132.951 10.6583 133.146 10.8536C133.342 11.0488 133.658 11.0488 133.854 10.8536L134.854 9.85355C135.049 9.65829 135.049 9.34171 134.854 9.14645ZM134.146 20.8536C134.342 21.0488 134.658 21.0488 134.854 20.8536C135.049 20.6583 135.049 20.3417 134.854 20.1464L133.854 19.1464C133.658 18.9512 133.342 18.9512 133.146 19.1464C132.951 19.3417 132.951 19.6583 133.146 19.8536L134.146 20.8536Z" fill="#CC2635"></path></g>
                <defs>
                  <filter id="filter0_i_3881_557" x="0" y="0" width="68" height="66" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset></feOffset><feGaussianBlur stdDeviation="1"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3881_557"></feBlend></filter>
                  <filter id="filter1_d_4430_8884" x="55" y="59" width="18" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                  <feOffset></feOffset><feGaussianBlur stdDeviation="1"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4430_8883"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4430_8883" result="shape"></feBlend></filter>
                  <filter id="filter2_d_4430_8884" x="189" y="59" width="18" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset></feOffset>
                  <feGaussianBlur stdDeviation="1"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4430_8883"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4430_8883" result="shape"></feBlend></filter>
                  <filter id="filter3_d_4430_8884" x="114" y="0" width="30" height="30" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset></feOffset><feGaussianBlur stdDeviation="1"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4430_8883"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4430_8883" result="shape"></feBlend></filter><linearGradient id="paint0_linear_4430_8884" x1="167.549" y1="76.7188" x2="50.9688" y2="76.7188" gradientUnits="userSpaceOnUse"><stop stop-color="#552278"></stop><stop offset="0.255606" stop-color="#D13438"></stop><stop offset="0.824634" stop-color="#BA4D52"></stop><stop offset="1" stop-color="#F87528"></stop></linearGradient><linearGradient id="paint0_linear_2195_5734" x1="140" y1="78.6025" x2="0.999749" y2="78.6025" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="0.255606" stop-color="#EFB839"></stop><stop offset="0.824634" stop-color="#EFB839"></stop><stop offset="1" stop-color="#EF5A39"></stop></linearGradient></defs>
              </svg>
            </div>
              <div className='sun-text-container'>
                <div className='sun-text'>
                  <span className='rise'>
                    <i class="fa-solid fa-sun"></i>
                    {sunrise}</span> <br/>
                  <span className='set'>
                  <i class="fa-solid fa-sun"></i>
                    {sunset}</span>
                </div>
              </div>
          </div>
          <div className="small uv">
            <div>
              <span className='uv-head'>UV</span>
            </div>
            <div className='uv-container'>
              <svg width="100" height="100" viewBox="5 -12 171 178" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 90.5 80 m 76 0 a 76 76 0 0 1 -28 58 " transform="rotate(11 90.5 80)" fill="none" stroke="#5C2E91" stroke-width="10" stroke-linecap="round"></path>
                <path d="M 90.5 80 m 76 0 a 76 76 0 0 1 -28 58 " transform="rotate(-52 90.5 80)" fill="none" stroke="#D13438" stroke-width="10" stroke-linecap="round"></path>
                <path d="M 90.5 80 m 76 0 a 76 76 0 0 1 -28 58 " transform="rotate(-115 90.5 80)" fill="none" stroke="#FF8C00" stroke-width="10" stroke-linecap="round"></path>
                <path d="M 90.5 80 m 76 0 a 76 76 0 0 1 -28 58 " transform="rotate(-178 90.5 80)" fill="none" stroke="#FDE300" stroke-width="10" stroke-linecap="round"></path>
                <path d="M 90.5 80 m 76 0 a 76 76 0 0 1 -28 58 " transform="rotate(-240 90.5 80)" fill="none" stroke="#73AA24" stroke-width="10" stroke-linecap="round"></path>
              
                <g><circle cx={uvPointX} cy={uvPointY} r="10" fill={uv < 3 ? "#73AA24" : uv < 6 ? "#FDE300" : uv < 8 ? "#FF8C00" : uv<11 ? "#D13438" :  "#5C2E91" }></circle>
                <circle cx={uvPointX} cy={uvPointY} r="11.5" stroke="#333333" stroke-width="3"></circle></g>          
              </svg>
            </div>
            <div className='uv-text'>
              <span  style={{ color: uv < 3 ? "#73AA24" : uv < 6 ? "#FDE300" : uv < 8 ? "#FF8C00" : uv<11 ? "#D13438" :  "#5C2E91" }}>{uv}</span>
            </div>
            <div className='uv-evaluate' style={{ color: uv < 3 ? "#73AA24" : uv < 8 ? "#FF8C00" : "#AE47D6" }}>
              <span>{uv < 3? "Low": uv < 8 ? "Medium": "High"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="light-control">
        <div>
          <div className="header">
            <span>Your Light</span>
            <div className={`switch ${isOn ? "on" : "off"}`} onClick={toggleLight}>
              <div className="toggle"></div>
            </div>
          </div>
          <div className="virtual-light">
            <div
              className={`light ${isOn ? "on" : "off"}`}
              style={{
                backgroundColor: selectedColor,
                opacity: intensity / 100, // Điều chỉnh độ sáng dựa trên giá trị intensity
              }}
            ></div>
          </div>

          <div>
            <span className='mode-text'>Mode</span>
            <div className="mode">
              {Object.keys(modes).map((mode) => (
                <div
                  key={mode}
                  className={`mode-block ${selectedMode === mode ? 'selected' : ''}`}
                  onClick={() => handleModeChange(mode)}
                >
                  {modes[mode].label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='intensity'>
          <span>{intensity}%</span>
          <div className="slider-container">
            <ReactSlider
              min="0"
              max="100"
              orientation="vertical"
              invert 
              value={intensity}
              onChange={handleIntensityChange}
              className="slider" 
              thumbClassName="thumb" 
              trackClassName="track" 
            />
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
