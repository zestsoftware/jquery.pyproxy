from setuptools import setup, find_packages
import sys, os

def get_file_contents(filename):
    file_path = os.path.join(filename)
    this_file = open(file_path)
    contents = this_file.read().strip()
    this_file.close()
    return contents

version = get_file_contents('jquery/pyproxy/version.txt')
history = get_file_contents('jquery/pyproxy/HISTORY.txt')
roadmap = get_file_contents('jquery/pyproxy/ROADMAP.rst')
readme = get_file_contents('README.rst')
long = "%s\n\n\n%s\n\n%s" % (readme, roadmap, history)

setup(name='jquery.pyproxy',
      version=version,
      description="A simple python egg and jquery plugin to easily use JQuery in Django/Plone/.. websites.",
      long_description=long,
      classifiers=[
        ],
      keywords='',
      author='Vincent Pretre',
      author_email='vincent.pretre@gmail.com',
      url='http://github.com/vincent-psarga/jquery.pyproxy',
      license='GPL',
      packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
      namespace_packages=['jquery'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'simplejson',
      ],
      entry_points="""
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
