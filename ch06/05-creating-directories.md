---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 5. ディレクトリの作成
current: ch06-05
prev: 04-dde-connections
prev-title: 4. DDE 接続
next: 06-multi-media-installations
next-title: 6. 複数メディアのインストーラ
origin: /com-expression-syntax-miscellanea/creating-directories/
---
#  Lesson 6 COM、式の構文、その他

## 5. ディレクトリの作成

場合によっては、ファイルをインストールせずに、ディレクトリだけを新しく作らなければならないことがあります。
以下がその方法です。

{% highlight xml %}
<Directory Id="TARGETDIR" Name="SourceDir">
  <Directory Id="ProgramFilesFolder" Name="PFiles">
    <Directory Id="test" Name="test">
      <Component Id="test"
          Guid="YOURGUID-4884-4A01-AA04-84B92D222428"
          SharedDllRefCount="no" KeyPath="no" NeverOverwrite="no"
          Permanent="no" Transitive="no" Win64="no"
          Location="either">
        <CreateFolder/>
      </Component>
    </Directory>
  </Directory>
</Directory>

<Feature Id="test" Title="testfolder" Level="1">
  <ComponentRef Id="test"/>
</Feature>
{% endhighlight %}
