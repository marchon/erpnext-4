// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

// render
frappe.listview_settings['Purchase Invoice'] = {
	add_fields: ["supplier", "supplier_name", "base_grand_total", "outstanding_amount", "due_date", "company",
		"currency", "is_return"],
	get_indicator: function(doc) {
		if(cint(doc.is_return)==1) {
			return [__("Return"), "darkgrey", "is_return,=,Yes"];
		} else if(flt(doc.outstanding_amount) > 0 && doc.docstatus==1) {
			if(frappe.datetime.get_diff(doc.due_date) < 0) {
				return [__("Overdue"), "red", "outstanding_amount,>,0|due_date,<,Today"];
			} else {
				return [__("Unpaid"), "orange", "outstanding_amount,>,0|due,>=,Today"];
			}
		} else if(flt(doc.outstanding_amount) < 0 && doc.docstatus == 1) {
			return [__("Debit Note Issued"), "darkgrey", "outstanding_amount,<,0"]
		}else if(flt(doc.outstanding_amount)==0 && doc.docstatus==1) {
			return [__("Paid"), "green", "outstanding_amount,=,0"];
		}
	},
	onload: function(listview) {
                listview.page.add_menu_item(__("Send SMS of Overdue invoices"), function() {

                        frappe.confirm(
                                "Are you sure want to send an sms ?",
                                function(){
                                        frappe.call(
                                                {
                                                        method: "erpnext.accounts.doctype.purchase_invoice.purchase_invoice.purchase_overdue",
                                                        callback: function(r) {
                                                                if(r.message == '202')
                                                                        show_alert("Message sent successfully",8);
                                                                else
                                                                        show_alert("Problem in Sending SMS. Sorry for the inconvenience. Please Contact us",8);
                                                        }
                                                }
                                        );
                                },
                                function(){
                                        window.close();
                                }
                        )
                });

        }

};
