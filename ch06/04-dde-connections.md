---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 4. DDE 接続
chapter: ch06
current: ch06-04
prev: 03-formatted-strings
prev-title: 3. 書式指定文字列
next: 05-creating-directories
next-title: 5. ディレクトリの作成
origin: /com-expression-syntax-miscellanea/dde-connections/
---
#  Lesson 6 COM、式の構文、その他

## 4. DDE 接続

DDE (Dynamic Data Exchange) を使うシェル接続は、下記のようにしてセットアップ出来ます。

{% highlight xml %}
<ProgId Id='Program.xyz' Description='Program handling .xyz'
    Advertise='yes'>
  <Extension Id='xyz' ContentType='text/sql'>
    <Verb Id='open' Sequence='1' Command='Open' Argument='"%1"'/>
  </Extension>
  <Extension Id='xyz0' ContentType='text/sql'>
    <Verb Id='open' Sequence='1' Command='Open' Argument='"%1"'/>
  </Extension>
</ProgId>

<Component Id='regSetup' Guid='YOURGUID-6D8A-4AE2-9D9F-3E074F13A029'>
  <Registry Root='HKLM'
      Key='SOFTWARE\Classes\Program.xyz\shell\open\ddeexec'
      Type='string' Value='[\[]open("%1")[\]]' KeyPath='yes'/>
  <Registry Root='HKLM'
      Key='SOFTWARE\Classes\Program.xyz\shell\open\ddeexec\application'
      Type='string' Value='Program.xyz' />
  <Registry Root='HKLM'
      Key='SOFTWARE\Classes\Program.xyz\shell\open\ddeexec\topic'
      Type='string' Value='System' />
</Component>
{% endhighlight %}
