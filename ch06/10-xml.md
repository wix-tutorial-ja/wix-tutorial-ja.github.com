---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 10. XML
chapter: ch06
current: ch06-10
prev: 09-environmentally-friendly
prev-title: 9. 環境に優しく
next: 11-complus-applications
next-title: 11. COM+ アプリケーション
origin: /com-expression-syntax-miscellanea/xml/
---
#  Lesson 6 COM、式の構文、その他

## 10. XML

今日では、古い `.ini` 形式でなく、XML ベースの設定ファイルを使用するプログラムがますます増えています。
WiX は、インストールやアンインストールの際にそういう設定ファイルを修正するための、作成済みカスタム・アクションを持っています。
ここで、アプリケーションと一緒に Settings.xml というファイルをインストールすると仮定しましょう。
最初は、ファイルの中身は一番外側のタグだけです。

{% highlight xml %}
<settings>
</settings>
{% endhighlight %}

インストーラに新しいノードをいくつか追加させることにします。そして、ノードの一つには属性値を持たせます。

{% highlight xml %}
<settings>
  <add key="a_key" value="a_value">key_item
    <inside>inside_item</inside>
  </add>
</settings>
{% endhighlight %}

これを実現するためには、**XmlFile** タグを使うことが出来ます。
**Id** や **File** のような通常の属性とは別の、**Action**, **Name** および **Value** 属性が 
XML ファイルの中で何をするかを決定し、**ElementPath** 属性がどこでそれをするかを決定します。
この最後の属性は、標準的な [XPath 仕様言語[(http://www.w3.org/TR/xpath) を使って、実際の操作が適用される XML ノードを記述します。

- *Action = createElement* : **ElementPath** で指定されたノードの中に、**Name** の名前の新しいノードが作成されます。
- *Action = setValue* : **Name** が省略された場合は、**ElementPath** で指定されたノードの内部テキストに **Value**
  の値がセットされます。
  **Name** と **Value** の両方が指定された場合は、**ElementPath** で指定されたノードに **Name** の名前で
  **Value** の値を持った属性が入ります。
- *Action = deleteValue* : **Name** と **Value** の両方が省略された場合は、**ElementPath** で指定されたノードの内部テキストが削除されます。
  **Name** が指定された場合は、**ElementPath** で指定されたノードから、**Name** の名前の属性が削除されます。

という訳で、計画した修正を実行するために、下記の項目を記述します
(自分自身で操作の順序 (**Sequence**) を指定しなければならないことに注意して下さい。
このことは、アンインストールの時に、正しい逆順で変更が削除されることを保証するために、重要なことです)。

{% highlight xml %}
<Component Id='Settings' Guid='YOURGUID-574D-4A9A-A266-5B5EC2C022A4'>
  <File Id='XmlSettings' Name='settings.xml' DiskId='1'
      Source='settings.xml' Vital='yes' />
  <util:XmlFile Id='XmlSettings1' File='[INSTALLDIR]settings.xml'
      Action='createElement' Name='add'
      ElementPath='//settings'
      Sequence='1' />
  <util:XmlFile Id='XmlSettings2' File='[INSTALLDIR]settings.xml'
      Action='setValue' Name='key' Value='a_key' 
      ElementPath='//settings/add'
      Sequence='2' />
  <util:XmlFile Id='XmlSettings3' File='[INSTALLDIR]settings.xml'
      Action='setValue' Name='value' Value='a_value' 
      ElementPath='//settings/add'
      Sequence='3' />
  <util:XmlFile Id='XmlSettings4' File='[INSTALLDIR]settings.xml'
      Action='setValue' Value='key_item' 
      ElementPath='//settings/add'
      Sequence='4' />
  <util:XmlFile Id='XmlSettings5' File='[INSTALLDIR]settings.xml'
      Action='createElement' Name='inside' 
      ElementPath='//settings/add'
      Sequence='5' />
  <util:XmlFile Id='XmlSettings6' File='[INSTALLDIR]settings.xml'
      Action='setValue' Value='inside_item' 
      ElementPath='//settings/add/inside'
      Sequence='6' />
</Component>
{% endhighlight %}

XML ファイルの中に同じ名前を持った複数のノードが有る場合は、どのノードを参照しているのかを特定するために、
よくある `'node[@attr="value"]'` という XPath の形式を使うことが出来ます。
**ElementPath** は書式指定文字列を受け入れますので、角括弧を使う時は、プロパティとして評価されないように、
バックスラッシュでエスケープしなければいけません (`[\[]` および `[\]]`)。

この機能は標準のユーティリティー・モジュールに入っていますので、それをリンクしなければなりません。

{% highlight bat %}
light.exe -ext WixUtilExtension -out Sample.msi Sample.wixobj
{% endhighlight %}
