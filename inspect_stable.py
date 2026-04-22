import codecs
f_in = codecs.open('index_stable.html', 'r', 'utf-16')
content = f_in.read()
f_in.close()

f_out = open('check_stable_hero.txt', 'w', encoding='utf-8')
idx = content.find('<section class="fan-hero"')
if idx != -1:
    f_out.write(content[idx:idx+3000])
else:
    f_out.write("NOT FOUND")
f_out.close()
