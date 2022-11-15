    # input_attractionId = request.args.get("attractionId","")
    
    # # print(input_attractionId)

    # if input_attractionId != None:
    #   mycursor.execute("select * from data where id = %s",(input_attractionId,))
    #   sql_data_id = mycursor.fetchall()
    #   print(sql_data_id)
    #   # return print(sql_data_id)
    #   if sql_data_id != False:
    #     data_id_api= {
    #       "data":sql_data_id
    #     }
    #     return jsonify(data_id_api)
    #   else:
    #     data_id_api_error={
    #       "error": True,
    #       "message": "請按照情境提供對應的錯誤訊息"
    #     }
    #     return jsonify(data_id_api_error)
