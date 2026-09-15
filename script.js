(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var company = form.company.value.trim();
      var location = form.location.value.trim();
      var type = form.type.value;
      var message = form.message.value.trim();

      var subject = 'Project enquiry: ' + type + (company ? ' — ' + company : '');
      var bodyLines = [
        'Name: ' + name,
        'Company / Operator: ' + (company || '-'),
        'Platform / Location: ' + (location || '-'),
        'Project type: ' + type,
        '',
        message
      ];
      var mailto = 'mailto:aliffcreative@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;

      var confirmBox = document.getElementById('confirmBox');
      if (confirmBox) {
        confirmBox.classList.add('show');
        confirmBox.scrollIntoView({ block: 'nearest' });
      }
    });
  }
})();
