---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 7. プログラムの追加と削除の項目
chapter: ch06
current: ch06-07
prev: 06-multi-media-installations
prev-title: 6. 複数メディアのインストーラ
next: 08-new-user-on-the-block
next-title: 8. 新顔のユーザー
origin: /com-expression-syntax-miscellanea/add-or-remove-programs-entries/
---
#  Lesson 6 COM、式の構文、その他

## 7. プログラムの追加と削除の項目

コントロール・パネル の「プログラムと機能」の中で、プログラムは、電話番号やインターネットの連絡先など、いろんな項目を保持することが出来ます。
それらを指定するためには、下記のプロパティをソース・ファイルに追加して下さい。

{% highlight xml %}
<Property Id='ARPCOMMENTS'>コメント</Property>
<Property Id='ARPCONTACT'>問い合わせ先</Property>
<Property Id='ARPHELPLINK'>ヘルプ・リンク</Property>
<Property Id='ARPURLINFOABOUT'>製品情報のURL</Property>
<Property Id='ARPURLUPDATEINFO'>製品の更新情報のURL</Property>
<Property Id='ARPHELPTELEPHONE'>ヘルプ電話番号</Property>
<Property Id='ARPREADME'>説明ファイルのパス</Property>
<Property Id='ARPSIZE'>アプリケーションのサイズ(KB単位)</Property>
{% endhighlight %}

**ARPSIZE** は一見すると余分なものに思われます。
しかし、テストをしてみると分ることですが、Windows Installer は非常に小さなパッケージに対しては、完全に嘘の値(4 GB以上)をレポートします。
その場合、パッケージ・サイズを手動で設定しておくことで、この鬱陶しいけれども無害な障害を回避することが出来ます。

アプリケーション項目の左に表示されるアイコンを指定するためには、(**Shortcut** タグで見たように) 
**Icon** の **Id** 属性への参照を使います (識別子に同じ拡張子を追加することも忘れないでください)。

{% highlight xml %}
<Property Id='ARPPRODUCTICON'>appicon.ico</Property>
...
<Icon Id="appicon.ico" SourceFile="Application.ico" />
{% endhighlight %}

その他、アプリケーションが **プログラムの追加と削除** においてどのような振舞いをするかを制御するためのプロパティが二～三あります。
*変更* ボタンの表示を抑止する
(あるいは、Windows 2000 より前では、インストーラに製品のメンテナンスをさせず、削除だけが出来るようにする)
ためには、以下のようにします。

{% highlight xml %}
<Property Id='ARPNOMODIFY'>1</Property>
{% endhighlight %}

*削除* ボタンを無効化する(あるいは、Windows 2000 より前では、そのアプリケーションをリストから完全に削除する)ためには、以下のようにします。

{% highlight xml %}
<Property Id='ARPNOREMOVE'>1</Property>
{% endhighlight %}

Windows 2000 や XP で、このリストからアプリケーションを完全に削除するためには、上記の代りに、以下のようにしなければなりません。

{% highlight xml %}
<Property Id='ARPSYSTEMCOMPONENT'>1</Property>
{% endhighlight %}

*修復* 機能を抑止するためには、以下のようにします。

{% highlight xml %}
<Property Id='ARPNOREPAIR'>1</Property>
{% endhighlight %}
