import calendar
import datetime
import json
import types
from datetime import date, datetime, timedelta
from io import BytesIO
from typing import Type

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
from django.contrib import messages
from django.contrib.messages import constants
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.shortcuts import redirect, render
from django.template.loader import get_template
from django.views import View
from plotly.graph_objs import Scatter
from plotly.offline import plot
from plotly.subplots import make_subplots
from xhtml2pdf import pisa

from .models import llvn

var1 = {}

# Create your views here.
class c_index(View):
    def get(selt, request):
        return render(request,'DV_HFMD/home_DV.html')
    
    def post(sefl, request):
        name = request.POST.get('name')
        api_key = "2a288a2f0cb72495457665a234a60d26"
        language = 'vi'
        day_8 = []
        h_day_5 = []
        context={}
        if name :
            data = llvn.objects.filter(name__icontains=name)
            if data:
                for item in data:
                    # Lấy tọa độ được chọn 
                    lat = item.lat
                    lon = item.lon
                    
                url = "https://api.openweathermap.org/data/2.5/onecall?lat=%s&lon=%s&appid=%s&units=metric&lang=%s&exclude=minutely" % (lat, lon, api_key, language)
                response = requests.get(url)
                
                data_weather = response.json()
                # tên tỉnh thành
                name = name 
                # nhiệt độ hiện tại
                current_temperature = data_weather['hourly'][0]['temp']
                # nhiệt độ lớn nhất
                max_temperature = data_weather['daily'][0]['temp']['max']
                # nhiệt độ nhỏ nhất 
                min_temperature = data_weather['daily'][0]['temp']['min']
                # trạng thái thời tiết
                description = data_weather['hourly'][0]['weather'][0]['description']
                # độ ẩm hiện tại
                current_humidity = data_weather['current']['humidity']
                # Tốc độ gió
                current_wind_speed = data_weather['current']['wind_speed'] 
                # Thời gian cap nhật gần nhất
                Last_update_time = datetime.fromtimestamp(data_weather['current']['dt'])
                #ngày hiện tại
                today = date.today().strftime('%d-%m-%Y')
                # icon
                current_icon = data_weather['current']['weather'][0]['icon'] 
                
                # ========================================
                
                try:
                    current_rain = data_weather['current']['rain']['1h']
                except:
                    current_rain = 0.0
                for item in data_weather['daily'] :
                    # nhiệt độ 8 ngày tiếp theo
                    temp = item['temp']['day']
                    # thời gian 8 ngày tiếp theo 
                    time = item['dt']
                    # độ ẩm 8 ngày tiếp theo
                    hum = item['humidity']
                    # Lượng mưa 
                    try:
                        rain = item['rain']
                    except: 
                        rain = 0.0
                    #icon
                    icon = data_weather['current']['weather'][0]['icon'] 
                    
                    record = {"time": time , "temp" : temp, "hum" : hum,'icon':icon, 'rain': rain}
                    day_8.append(record)
                # =============================
                l_day_today = date.today()
                l_day = []
                for x in range(5,0,-1):
                    if x == 5 :
                        d = l_day_today
                        d = calendar.timegm(d.timetuple())
                        l_day.append(d)
                    d = l_day_today - timedelta(x)
                    d = calendar.timegm(d.timetuple())
                    url2 = 'https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=%s&lon=%s&dt=%s&appid=%s&units=metric&lang=%s&exclude=minutely,hourly,alerts'%(lat , lon,d ,api_key,language)
                    response =  requests.get(url2)
                    data_h_weather = response.json()
                    # nhiệt độ 5 ngày trước
                    h_temp = data_h_weather['current']['temp']
                    # thời gian 5 ngày trước 
                    h_time = data_h_weather['current']['dt']
                    # độ ẩm 5 ngày trước
                    h_hum = data_h_weather['current']['humidity']
                    # Lượng mưa 5 ngày trước
                    try:
                        h_rain = data_h_weather['current']['rain']
                    except: 
                        h_rain = 0.0
  
                    h_record = {"time": h_time , "temp" : h_temp, "hum" : h_hum,'rain': h_rain}
                    h_day_5.append(h_record)
                    
                with open('D:/wamp64/www/DV-HFMD/KLTN-Project/mysite/DV_HFMD/static/json/maindata.json', encoding="utf8") as response1:
                    counties = json.load(response1)
                df = pd.read_csv('D:/wamp64/www/DV-HFMD/KLTN-Project/mysite/DV_HFMD/static/csv/numofca.csv')
                fig = px.choropleth(df, geojson=counties, locations='id', color='mun',
                        color_continuous_scale="Viridis",
                        range_color=(0, 40),
                        scope="asia",
                        labels={'mun':'number of infections', 'id':'id'}
                        )
                fig.update_geos(
                    center=dict(lon=lon, lat=lat),
                    projection_scale=2,
                    lonaxis_range= [ -15.0, -10.0 ],
                    lataxis_range= [ 0.0, 15.0 ],
                )
                response1.close()
                
                fig.update_layout(autosize=False, width=555,height=1022,margin=dict(l=0, r=0, t=0, b=0, pad=4, autoexpand = True))       
                plot_div = plot(fig, output_type='div')                

                context = {'lon' : lon,'lat': lat,
                           'today':today,
                           'name': name,
                           'current_icon':current_icon,
                           'description':description,
                           'h_day_5':h_day_5,
                           'day_8':day_8,
                           'current_rain': current_rain,
                           'current_humidity':current_humidity,
                           'current_wind_speed':current_wind_speed,
                           'min_temperature':min_temperature,
                           'current_temperature':current_temperature,
                           'plot_div': plot_div}
                global var1
                var1 = {"khang ": "khangne"}
                return render(request, 'DV_HFMD/home_DV.html',context ) 
            else:
                print("NUll")
                messages.error(request ,'Không có tỉnh thành này!' )
                return redirect('/')
    
def search(request):
    name = request.GET.get('name')
    payload = []
    if name :
        data = llvn.objects.filter(name__icontains=name)
        for item in data:
            payload.append(item.name)
    return JsonResponse({'status': 200,'payload':payload})

dataPDF = {}
def render_to_pdf(template_src, context_dict={}):
    global var1
    print(var1)
    template = get_template(template_src)
    html = template.render(context_dict)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode('utf-8')),result)
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None


class ViewPDF(View):
	def get(self, request, *args, **kwargs):

		pdf = render_to_pdf('DV_HFMD/pdf_template.html', dataPDF)
		return HttpResponse(pdf, content_type='application/pdf')
        
#Automaticly downloads to PDF file
class DownloadPDF(View):
	def get(self, request, *args, **kwargs):
		pdf = render_to_pdf('DV_HFMD/pdf_template.html', dataPDF)
		response = HttpResponse(pdf, content_type='application/pdf')
		filename = "tenFile%s.pdf" %("1")
		content = "attachment; filename='%s'" %(filename)
		response['Content-Disposition'] = content
		return response
def view_down_pdf(request):
	context = {}
	return render(request, 'DV_HFMD/view_down_pdf.html', context)
