import datetime


class convert_shift:
    def __init__(self, *args, **kwargs):
        super(convert_shift, self).__init__()

    def convert_shift_to_int(self, shift):
        shift_int = {'morning': 0, 'afternoon': 1, 'night': 2}
        return shift_int.get(shift)


class ticket_handling:
    def __init__(self, *args, **kwargs):
        super(ticket_handling, self).__init__()

    def get_current_ticket_status_outage(self, *args, **kwargs):
        """
        Returns Current state of the ticket based on requested date and shift
        """
        req_date = kwargs['req_date']

        filter_df = kwargs['filter_df']
        shift_key = convert_shift()
        shift = shift_key.convert_shift_to_int(kwargs['shift'])
        res = []
        for k, row in filter_df.iterrows():

            temp = {
                "start_date": datetime.datetime.strptime(str(row["start_time"]).split(" ")[0], "%Y-%m-%d"),

                "start_shift": shift_key.convert_shift_to_int(row["shift"].lower()),
                "end_shift": None,
                "status": row["Status"],
                "data": {'ID': row['id'], "Ticket_ID": row['Ticket_ID'], "Subject": row['Subject'], "customer_impact": row['customer_impact'], "Action_Required": row['Action_Required'], "Status": row['Status'], "created_date": row['created_date'], "date": row['date'], "shift": row['shift'], "start_date": row['start_time'], "end_time": row
                         ['end_time']}
            }

            try:

                temp["end_date"] = datetime.datetime.strptime(
                    str(row["end_time"]).split(" ")[0], "%Y-%m-%d")
            except ValueError:
                temp["end_date"] = None
            try:
                end_shift = shift_key.convert_shift_to_int(
                    filter_df["shift"][k+1].lower())
            except KeyError:
                end_shift = None

            temp["end_shift"] = end_shift

            res.append(temp)

        _fin = None

        for r in res:
            if r['end_date'] is not None:
                if r["start_date"] == req_date:
                    if r["start_shift"] <= shift:
                        if r["status"] == "Resolved":
                            if r["start_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["end_date"] == req_date:
                    if r["end_shift"] >= shift:
                        if r["status"] == "Resolved":
                            if r["end_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["start_date"] < req_date < r["end_date"]:
                    _fin = r
            else:

                if req_date >= r["start_date"]:

                    if shift >= r['start_shift'] and req_date >= r["start_date"]:
                        _fin = r
                    elif _fin is None:
                        _fin = r

        if _fin:
            if _fin != "NULL":
                ret_val = _fin['data']
            else:
                ret_val = _fin

            return ret_val

    def get_current_ticket_status_Follow_up(self, *args, **kwargs):
        """
        Returns Current state of the ticket based on requested date and shift
        """
        req_date = kwargs['req_date']

        filter_df = kwargs['filter_df']
        shift_key = convert_shift()
        shift = shift_key.convert_shift_to_int(kwargs['shift'])
        res = []
        for k, row in filter_df.iterrows():

            temp = {
                "start_date": datetime.datetime.strptime(str(row["start_time"]).split(" ")[0], "%Y-%m-%d"),

                "start_shift": shift_key.convert_shift_to_int(row["shift"].lower()),
                "end_shift": None,
                "status": row["Status"],
                "data": {'ID': row['id'], "Ticket_ID": row['Ticket_ID'], "Subject": row['Subject'],
                         "Action_Taken": row['Action_Taken'], "Action_Required": row['Action_Required'],
                         "Status": row['Status'], "created_date": row['created_date'], "date": row['date'], "shift": row['shift'],
                         "start_date": row['start_time'], "end_date": row['end_time']
                         }
            }

            try:

                temp["end_date"] = datetime.datetime.strptime(
                    str(row["end_time"]).split(" ")[0], "%Y-%m-%d")
            except ValueError:
                temp["end_date"] = None
            try:
                end_shift = shift_key.convert_shift_to_int(
                    filter_df["shift"][k+1].lower())
            except KeyError:
                end_shift = None

            temp["end_shift"] = end_shift

            res.append(temp)

        _fin = None

        for r in res:
            if r['end_date'] != None:
                if r["start_date"] == req_date:
                    if r["start_shift"] <= shift:
                        if r["status"] == "Resolved":
                            if r["start_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["end_date"] == req_date:
                    if r["end_shift"] >= shift:
                        if r["status"] == "Resolved":
                            if r["end_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["start_date"] < req_date < r["end_date"]:
                    _fin = r
            else:
                if req_date >= r["start_date"]:
                    if shift >= r['start_shift'] and req_date >= r["start_date"]:
                        _fin = r
                    elif _fin is None:
                        _fin = r

        if _fin:
            if _fin != "NULL":
                ret_val = _fin['data']
            else:
                ret_val = _fin

            return ret_val

    def get_current_ticket_status_SM_INFRA(self, *args, **kwargs):
        """
        Returns Current state of the ticket based on requested date and shift
        """
        req_date = kwargs['req_date']

        filter_df = kwargs['filter_df']
        shift_key = convert_shift()
        shift = shift_key.convert_shift_to_int(kwargs['shift'])
        res = []
        for k, row in filter_df.iterrows():

            temp = {
                "start_date": datetime.datetime.strptime(str(row["planned_start_date"]).split(" ")[0], "%Y-%m-%d"),

                "start_shift": shift_key.convert_shift_to_int(row["shift"].lower()),
                "end_shift": None,
                "status": row["pre_check_status"],
                "data": {'id': row['id'],
                         "planned_start_date": row['planned_start_date'], "planned_end_date": row["planned_end_date"],
                         "ticket_id": row["ticket_id"], "subject": row["subject"], "pre_check_status": row["pre_check_status"],
                         'shift': row['shift'], "floatingImplementation": row["floatingImplementation"],"assigned":row['assigned'],'remarks':row['remarks']}
            }

            try:

                temp["end_date"] = datetime.datetime.strptime(
                    str(row["planned_end_date"]).split(" ")[0], "%Y-%m-%d")
            except ValueError:
                temp["end_date"] = None
            try:
                end_shift = shift_key.convert_shift_to_int(
                    filter_df["shift"][k+1].lower())
            except KeyError:
                end_shift = None

            temp["end_shift"] = end_shift

            res.append(temp)

        _fin = None
        for r in res:

            if r['end_date'] != None:

                if r["start_date"] == req_date:

                    if r["start_shift"] <= shift:
                        if r["status"] == "Resolved":
                            if r["start_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["end_date"] == req_date:
                    if r["end_shift"] >= shift:
                        if r["status"] == "Resolved":
                            if r["end_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["start_date"] < req_date < r["end_date"]:

                    _fin = r
            else:

                if req_date >= r["start_date"]:
                    if shift >= r['start_shift']:
                        _fin = r
                    elif _fin is None:
                        _fin = r

        if _fin:
            if _fin != "NULL":
                ret_val = _fin['data']
            else:
                ret_val = _fin

            return ret_val

    def get_current_ticket_status_WeeekendActivity(self, *args, **kwargs):
        """
        Returns Current state of the ticket based on requested date and shift
        """
        req_date = kwargs['req_date']

        filter_df = kwargs['filter_df']
        shift_key = convert_shift()
        shift = shift_key.convert_shift_to_int(kwargs['shift'])
        res = []
        for k, row in filter_df.iterrows():

            temp = {
                "start_date": datetime.datetime.strptime(str(row["planned_start_date"]).split(" ")[0], "%Y-%m-%d"),

                "start_shift": shift_key.convert_shift_to_int(row["shift"].lower()),
                "end_shift": None,
                "status": row["pre_check_status"],
                "data": {'ID': row['id'], "pre_check_status_text": row['pre_check_status_text'], "region": row['region'], "planned_type": row["planned_type"],
                         "planned_start_date": row['planned_start_date'], "planned_end_date": row["planned_end_date"],
                         "ticket_id": row["ticket_id"], "subject": row["subject"], "pre_check_status": row["pre_check_status"],
                         "comments": row["comments"], "cr_id": row["cr_id"], "cr_approval": row["cr_approval"], "resource": row["resource"],
                         'shift': row['shift'], "floatingCmpDate": row['floatingCmpDate'],"assigned":row['assigned'],'remarks':row['remarks']}
            }

            try:

                temp["end_date"] = datetime.datetime.strptime(
                    str(row["planned_end_date"]).split(" ")[0], "%Y-%m-%d")
            except ValueError:
                temp["end_date"] = None
            try:
                end_shift = shift_key.convert_shift_to_int(
                    filter_df["shift"][k+1].lower())
            except KeyError:
                end_shift = None

            temp["end_shift"] = end_shift

            res.append(temp)

        _fin = None
        for r in res:

            if r['end_date'] != None:

                if r["start_date"] == req_date:

                    if r["start_shift"] <= shift:
                        if r["status"] == "Resolved":
                            if r["start_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["end_date"] == req_date:
                    if r["end_shift"] >= shift:
                        if r["status"] == "Resolved":
                            if r["end_shift"] == shift:
                                _fin = r
                            else:
                                _fin = "NULL"
                        else:
                            _fin = r

                elif r["start_date"] < req_date < r["end_date"]:

                    _fin = r
            else:

                if req_date >= r["start_date"]:
                    if shift >= r['start_shift']:
                        _fin = r
                    elif _fin is None:
                        _fin = r

        if _fin:
            if _fin != "NULL":
                ret_val = _fin['data']
            else:
                ret_val = _fin

            return ret_val
