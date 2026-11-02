// 可預約時段週曆：桌面顯示表格，手機顯示清單
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { useAvailability } from '../../hooks/useAvailability';
import {
  formatDate,
  formatMonthRange,
  formatTime,
  startOfWeek,
  toTaipei,
  todayInTaipei,
  weekdayLabel,
} from '../../lib/datetime';
import style from '../../styles/AvailabilityWeekGrid.module.css';

const DEFAULT_MAX_ADVANCE_DAYS = 60;

// 每種狀態對應的文字和樣式，同時用文字表示，不只靠顏色
const STATUS = {
  available: { label: '可預約', className: style.available },
  booked: { label: '已額滿', className: style.booked },
  closed: { label: '休息', className: style.closed },
  past: { label: '已過期', className: style.past },
  too_soon: { label: '未開放', className: style.tooSoon, title: '需於 3 天前預約' },
};

// 往前或往後移動幾週
const shiftWeek = (weekStart, weeks) => formatDate(toTaipei(weekStart).add(weeks * 7, 'day'));

// 給螢幕閱讀器念的文字，例如「11月5日 星期四 10:00 可預約」
const slotAriaLabel = (slot, label) => {
  const date = toTaipei(slot.start);
  return `${date.format('M月D日')} 星期${weekdayLabel(slot.start)} ${formatTime(slot.start)} ${label}`;
};

const getStatusText = (slot, day) =>
  slot.status === 'closed' && day.closedReason ? day.closedReason : STATUS[slot.status].label;

// 單一時段：可預約的是按鈕，其他狀態只是文字
const SlotCell = ({ slot, day, onSelect, className = style.cell, children }) => {
  const status = STATUS[slot.status];
  const text = getStatusText(slot, day);
  if (slot.status === 'available') {
    return (
      <button
        type="button"
        className={`${className} ${status.className}`}
        aria-label={slotAriaLabel(slot, text)}
        onClick={() => onSelect(slot)}
      >
        {children ?? text}
      </button>
    );
  }
  return (
    <span className={`${className} ${status.className}`} title={status.title}>
      {children ?? text}
    </span>
  );
};

const Legend = () => (
  <ul className={style.legend} aria-label="圖例">
    {Object.entries(STATUS).map(([key, { label, className }]) => (
      <li key={key}>
        <span className={`${style.swatch} ${className}`} aria-hidden="true" />
        {label}
      </li>
    ))}
  </ul>
);

// 桌面版：七天的週表格
const DesktopTable = ({ days, onSelect }) => (
  <div className={style.tableWrap}>
    <table className={style.table}>
      <thead>
        <tr>
          <th scope="col" className={style.timeHead}>
            時段
          </th>
          {days.map((day) => (
            <th scope="col" key={day.date}>
              {toTaipei(day.date).format('M/D')}（{weekdayLabel(day.date)}）
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days[0].slots.map((rowSlot, rowIndex) => (
          <tr key={rowSlot.start}>
            <th scope="row" className={style.timeCell}>
              {formatTime(rowSlot.start)}–{formatTime(rowSlot.end)}
            </th>
            {days.map((day) => (
              <td key={day.date}>
                <SlotCell slot={day.slots[rowIndex]} day={day} onSelect={onSelect} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const hasAvailable = (day) => day.slots.some((slot) => slot.status === 'available');

// 手機版：上方選日期，下方列出當天時段
const MobileList = ({ days, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const selected =
    days.find((day) => day.date === selectedDate) ?? days.find(hasAvailable) ?? days[0];
  const visibleSlots = selected.slots.filter((slot) => slot.status !== 'closed');

  return (
    <>
      <div className={style.chips}>
        {days.map((day) => (
          <button
            type="button"
            key={day.date}
            aria-pressed={day.date === selected.date}
            className={`${style.chip} ${day.date === selected.date ? style.chipActive : ''}`}
            onClick={() => setSelectedDate(day.date)}
          >
            {toTaipei(day.date).format('MM/DD')} {weekdayLabel(day.date)}
          </button>
        ))}
      </div>
      {visibleSlots.length === 0 ? (
        <EmptyState message={selected.closedReason ?? '本日休息'} />
      ) : (
        <ul className={style.slotList}>
          {visibleSlots.map((slot) => (
            <li key={slot.start}>
              <SlotCell slot={slot} day={selected} onSelect={onSelect} className={style.slotItem}>
                <span>
                  {formatTime(slot.start)}–{formatTime(slot.end)}
                </span>
                <span>{getStatusText(slot, selected)}</span>
              </SlotCell>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const GridSkeleton = () => (
  <div role="status" aria-label="載入中">
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} variant="rounded" height={40} sx={{ mb: 1 }} />
    ))}
  </div>
);

const AvailabilityWeekGrid = ({ durationOptions, durationMin, onDurationChange, onSelectSlot }) => {
  const isDesktop = useMediaQuery('(min-width:768px)');
  const currentWeek = formatDate(startOfWeek(todayInTaipei()));
  const [weekStart, setWeekStart] = useState(currentWeek);
  const query = useAvailability({ weekStart, durationMin });

  const maxAdvanceDays = query.data?.maxAdvanceDays ?? DEFAULT_MAX_ADVANCE_DAYS;
  const lastDate = todayInTaipei().add(maxAdvanceDays, 'day');
  const canGoNext = !toTaipei(shiftWeek(weekStart, 1)).isAfter(lastDate);
  const days = query.data?.days;
  const weekIsFull = days && !days.some(hasAvailable);

  return (
    <section aria-label="可預約時段">
      <div className={style.toolbar}>
        <div className={style.weekNav}>
          <Button
            variant="outlined"
            disabled={weekStart <= currentWeek}
            onClick={() => setWeekStart(shiftWeek(weekStart, -1))}
          >
            ◀ 上一週
          </Button>
          <Button
            variant="text"
            disabled={weekStart === currentWeek}
            onClick={() => setWeekStart(currentWeek)}
          >
            本週
          </Button>
          <span className={style.monthLabel} aria-live="polite">
            {formatMonthRange(weekStart)}
          </span>
          <Button
            variant="outlined"
            disabled={!canGoNext}
            onClick={() => setWeekStart(shiftWeek(weekStart, 1))}
          >
            下一週 ▶
          </Button>
        </div>
        <TextField
          select
          size="small"
          label="服務時長"
          value={durationMin}
          onChange={(event) => onDurationChange(Number(event.target.value))}
          sx={{ minWidth: 140 }}
        >
          {durationOptions.map((minutes) => (
            <MenuItem key={minutes} value={minutes}>
              {minutes} 分鐘
            </MenuItem>
          ))}
        </TextField>
      </div>
      <Legend />
      {query.isLoading && <GridSkeleton />}
      {query.isError && !days && <ErrorState onRetry={query.refetch} />}
      {weekIsFull && (
        <EmptyState
          message="本週沒有可預約的時段，看看下一週"
          actionLabel={canGoNext ? '看下一週' : undefined}
          onAction={() => setWeekStart(shiftWeek(weekStart, 1))}
        />
      )}
      {days && !weekIsFull && (
        <div className={query.isPlaceholderData ? style.loadingOverlay : undefined}>
          {isDesktop ? (
            <DesktopTable days={days} onSelect={onSelectSlot} />
          ) : (
            <MobileList days={days} onSelect={onSelectSlot} />
          )}
        </div>
      )}
    </section>
  );
};

export default AvailabilityWeekGrid;
