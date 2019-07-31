/* eslint-disable no-loop-func */
// == Import : npm
import React from 'react';
import dateFns from 'date-fns';
import classNames from 'class-names';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// == Import : local
import events from 'src/components/Data/events.json';

// == Composant
const CellsWeek = ({ currentDate, selectedDate, onDateClick, idOpenEvent, openEvent }) => {

  const weekStart = dateFns.startOfWeek(currentDate);
  const weekEnd = dateFns.endOfWeek(weekStart);
  const startDate = dateFns.startOfDay(weekStart);
  const endDate = dateFns.endOfDay(weekEnd);

  const dateFormat = 'H';
  const rows = [];

  let hours = [];
  let hour = startDate;
  let formattedDate = '';

  // call click date function from reducer
  const dateClickHandler = (clonehour) => {
    onDateClick(dateFns.parse(clonehour));
  };

  // click on a event row to display the event page
  const clickHandleEvent = (evt) => {
    console.log(evt.target);
    const { id } = evt.target;
    openEvent(id);
  };


  const createTable = () => {
    let rowEvent = 1;
    while (hour <= endDate) {
      let keyCell = 1;
      for (let i = 1; i < 25; i += 1) {
        formattedDate = dateFns.format(hour, dateFormat);
        const clonehour = hour;
        const selected = classNames({
          disabled: dateFns.isSameWeek(hour, weekStart) === false,
          selected: dateFns.isSameWeek(hour, weekStart) && dateFns.isSameHour(hour, selectedDate),
        });
        hours.push(
          <div
            className={`col cell ${selected}`}
            key={hour}
            onClick={() => dateClickHandler(clonehour)}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        hour = dateFns.addHours(hour, 1);
      }
      rows.push(
        <div className="row" key={hour}>
          {hours}
          {/* I'm begining a loop on the events datas */}
          {events.map((event) => {
            // test to know if the row is under or outside an event period
            const colEventCenterRow = new Date(hours[6].key) > new Date(event.beginingDate)
            && new Date(hours[0].key) < new Date(event.endingDate) ? 1 : 0;
            const colSpanEventCenterRow = new Date(hours[6].key) > new Date(event.beginingDate)
            && new Date(hours[0].key) < new Date(event.endingDate) ? 24 : 0;
            // I'm finding case number where my event beggin
            const colCalc = hours.findIndex(hourC => dateFns.isSameHour(hourC.key, new Date(event.beginingDate))
            && dateFns.isSameDay(hourC.key, new Date(event.beginingDate))
            && dateFns.isSameMonth(hourC.key, new Date(event.beginingDate))
            && dateFns.isSameYear(hourC.key, new Date(event.beginingDate)))
            + 1;
            // If th result is 0, it's that the begining is not on the row,
            // so I use my test to know if it's empty or full row
            const col = colCalc === 0 ? colEventCenterRow : colCalc;

            // I use the same method for the end of the event and the span of the grid.
            const colSpanCalc = hours.findIndex(hourC => dateFns.isSameDay(hourC.key, new Date(event.endingDate))
            && dateFns.isSameHour(hourC.key, new Date(event.endingDate))
            && dateFns.isSameMonth(hourC.key, new Date(event.endingDate))
            && dateFns.isSameYear(hourC.key, new Date(event.endingDate)))
            + 1;
            const colSpan = colSpanCalc === 0 ? colSpanEventCenterRow : colSpanCalc - col + 1;

            // classNames to know if the event is the event display
            const eventDisplay = classNames({
              eventDisplay: idOpenEvent == event.id,
            });

            // if the test is empty we display the line
            const hidden = col === 0 ? 'none' : 'inline';
            // I create a styled components to fixe directly the col and span on the grid-colum style
            const Events = styled.div`
              grid-row: ${col} / span ${colSpan};
              grid-column: ${rowEvent} /span 3;
              display: ${hidden};
            `;
            rowEvent += 1; 
            // I return the event in the DOM
            return (
              <Events key={`${event.beginingDate}${hour} ${eventDisplay}`} className={`events event${rowEvent} ${eventDisplay}`} id={event.id} onClick={clickHandleEvent}>
                <div className="title">
                  {event.title}
                </div>
              </Events>
            )
          })}
        </div>
      );
      rowEvent = 1;
      hours = [];
    }
  };

  createTable();
  return (
    <div className="body">
      {rows}
    </div>
  );
};

CellsWeek.propTypes = {
  currentDate: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onDateClick: PropTypes.func.isRequired,
  idOpenEvent: PropTypes.string.isRequired,
  openEvent: PropTypes.func.isRequired,
};

// == Export
export default CellsWeek;
