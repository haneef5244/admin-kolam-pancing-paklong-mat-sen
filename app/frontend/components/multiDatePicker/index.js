'use client';
import * as React from 'react';
import moment from 'moment';
import { Calendar } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';

export default function MultiDatePicker({
    onChange,
    values
}) {

    return (
        <Calendar highlightToday={false} value={values} multiple onChange={onChange}
            plugins={[
                <DatePanel sort="date" header='Tarikh Pancing' />
            ]}
            minDate={moment().toDate()}
        />
    );
}
